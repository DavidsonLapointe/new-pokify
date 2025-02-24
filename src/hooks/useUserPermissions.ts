
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

  // Função auxiliar para expandir as permissões do dashboard
  const expandDashboardPermissions = (permissions: string[]) => {
    const expanded = [...permissions];
    // Não remove mais o dashboard caso não tenha subpermissões
    dashboardTabs.forEach(tab => {
      const subPermission = `dashboard.${tab}`;
      if (!expanded.includes(subPermission) && expanded.includes('dashboard')) {
        expanded.push(subPermission);
      }
    });
    return expanded;
  };

  useEffect(() => {
    if (isOpen && user) {
      console.log('Permissões atuais do usuário:', user.permissions);
      const initialPermissions = [...(user.permissions || [])];
      if (initialPermissions.includes('dashboard')) {
        dashboardTabs.forEach(tab => {
          const subPermission = `dashboard.${tab}`;
          if (!initialPermissions.includes(subPermission)) {
            initialPermissions.push(subPermission);
          }
        });
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
        
        if (!isDashboardEnabled) {
          // Adiciona o dashboard e todas as subpermissões
          newPermissions.push('dashboard');
          dashboardTabs.forEach(tab => {
            const subPermission = `dashboard.${tab}`;
            if (!newPermissions.includes(subPermission)) {
              newPermissions.push(subPermission);
            }
          });
        } else {
          // Remove apenas as subpermissões, mantendo o dashboard
          newPermissions = newPermissions.filter(p => 
            !p.startsWith('dashboard.') || p === 'dashboard'
          );
        }
      } else if (routeId.startsWith('dashboard.')) {
        const isSubPermissionEnabled = prev.includes(routeId);
        
        if (!isSubPermissionEnabled) {
          // Adiciona a subpermissão
          newPermissions.push(routeId);
          // Sempre mantém o dashboard principal
          if (!newPermissions.includes('dashboard')) {
            newPermissions.push('dashboard');
          }
        } else {
          // Remove apenas a subpermissão específica
          newPermissions = newPermissions.filter(p => p !== routeId);
          // Não remove mais o dashboard mesmo que não tenha subpermissões
        }
      } else {
        if (prev.includes(routeId)) {
          newPermissions = prev.filter(p => p !== routeId);
        } else {
          newPermissions.push(routeId);
        }
      }

      console.log('Novas permissões após mudança:', newPermissions);
      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    try {
      // Mantém o dashboard nas permissões finais
      const finalPermissions = [...tempPermissions];
      if (finalPermissions.includes('dashboard')) {
        finalPermissions.push(...dashboardTabs.map(tab => `dashboard.${tab}`));
      }

      const updatedUser = {
        ...user,
        permissions: [...new Set(finalPermissions)] // Remove duplicatas
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
