
import { User } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const dashboardTabs = [
  'leads', 'uploads', 'performance', 'objections', 'suggestions', 'sellers'
];

export const useUserPermissions = (
  user: User | null,
  isOpen: boolean,
  onClose: () => void,
  onUserUpdate: (user: User) => void
) => {
  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      console.log('Permissões atuais do usuário:', user.permissions);
      const initialPermissions = [...(user.permissions || [])];
      
      // Sempre adiciona o dashboard nas permissões iniciais
      if (!initialPermissions.includes('dashboard')) {
        initialPermissions.push('dashboard');
      }

      console.log('Permissões expandidas:', initialPermissions);
      setTempPermissions(initialPermissions);
    } else {
      setTempPermissions([]);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return;

    setTempPermissions(prev => {
      let newPermissions = [...prev];

      if (routeId === 'dashboard') {
        const isDashboardEnabled = prev.includes('dashboard');
        
        // Mantém o dashboard nas permissões, mas controla as subpermissões
        if (!isDashboardEnabled) {
          // Regra 1: Se marcar o dashboard, marca todas as subpermissões
          dashboardTabs.forEach(tab => {
            const subPermission = `dashboard.${tab}`;
            if (!newPermissions.includes(subPermission)) {
              newPermissions.push(subPermission);
            }
          });
        } else {
          // Regra 2: Se desmarcar o dashboard, remove apenas as subpermissões
          newPermissions = newPermissions.filter(p => 
            !p.startsWith('dashboard.') || p === 'dashboard'
          );
        }
      } else if (routeId.startsWith('dashboard.')) {
        const isSubPermissionEnabled = prev.includes(routeId);
        
        if (!isSubPermissionEnabled) {
          // Regra 3: Se marcar uma subpermissão, adiciona ela
          newPermissions.push(routeId);
        } else {
          // Remove apenas a subpermissão específica
          newPermissions = newPermissions.filter(p => p !== routeId);
        }
      } else {
        if (prev.includes(routeId)) {
          newPermissions = prev.filter(p => p !== routeId);
        } else {
          newPermissions.push(routeId);
        }
      }

      // Garante que dashboard sempre está presente
      if (!newPermissions.includes('dashboard')) {
        newPermissions.push('dashboard');
      }

      console.log('Novas permissões após mudança:', newPermissions);
      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        permissions: [...tempPermissions]
      };

      console.log('Salvando usuário com permissões:', updatedUser.permissions);

      if (user.id === currentUser.id) {
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

  const handleClose = () => {
    setTempPermissions([]);
    onClose();
  };

  return {
    saving,
    tempPermissions,
    handlePermissionChange,
    handleSave,
    handleClose,
  };
};
