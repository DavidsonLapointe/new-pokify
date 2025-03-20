
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { availableAdminRoutePermissions } from '@/types/admin-permissions';
import { toast } from 'sonner';

// Mapeamento de rotas para suas abas
const routeWithTabs = {
  dashboard: [
    "dashboard.analytics",
    "dashboard.organizations",
    "dashboard.financial"
  ],
  settings: [
    "settings.alerts",
    "settings.analysis",
    "settings.retention",
    "settings.llm",
    "settings.system",
    "settings.permissions"
  ],
  "credit-packages": [
    "credit-packages.manage",
    "credit-packages.sales"
  ],
  financial: [
    "financial.invoices",
    "financial.reports"
  ],
  organizations: [
    "organizations.manage",
    "organizations.support"
  ],
  modules: [
    "modules.manage",
    "modules.setups"
  ]
};

export const useAdminPermissions = (
  user: User | null,
  isOpen: boolean,
  onClose: () => void,
  onUserUpdate: (user: User) => void
) => {
  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen && user) {
      setTempPermissions(user.permissions || {});
    } else {
      setTempPermissions({});
    }
  }, [isOpen, user]);

  const hasPermission = (routeId: string): boolean => {
    return !!tempPermissions[routeId];
  };

  const handlePermissionChange = (routeId: string) => {
    if (routeId === 'profile') return;

    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      
      // Altera o valor da permissão selecionada
      newPermissions[routeId] = !prev[routeId];
      
      // Se for uma rota principal que foi desativada, desativa também todas as suas abas
      if (!newPermissions[routeId] && routeWithTabs[routeId]) {
        routeWithTabs[routeId].forEach(tabId => {
          newPermissions[tabId] = false;
        });
      }
      
      // Se for uma aba que foi ativada, certifique-se de que a rota principal também está ativa
      if (newPermissions[routeId] && routeId.includes('.')) {
        const mainRoute = routeId.split('.')[0];
        newPermissions[mainRoute] = true;
      }

      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedUser = {
        ...user,
        permissions: { ...tempPermissions, profile: true }
      };

      if (user.id === currentUser?.id) {
        updateCurrentUser(updatedUser);
      }

      onUserUpdate(updatedUser);
      onClose();
      toast.success("Permissões atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar permissões");
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    tempPermissions,
    hasPermission,
    handlePermissionChange,
    handleSave,
    handleClose: onClose,
  };
};
