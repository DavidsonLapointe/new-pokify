
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
    if (expanded.includes('dashboard')) {
      dashboardTabs.forEach(tab => {
        const subPermission = `dashboard.${tab}`;
        if (!expanded.includes(subPermission)) {
          expanded.push(subPermission);
        }
      });
    }
    return expanded;
  };

  useEffect(() => {
    if (isOpen && user) {
      console.log('Permissões atuais do usuário:', user.permissions);
      // Sempre expandir as permissões ao abrir o modal
      const initialPermissions = expandDashboardPermissions(user.permissions || []);
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
          // Adiciona dashboard e todas as subpermissões
          newPermissions.push('dashboard');
          dashboardTabs.forEach(tab => {
            const subPermission = `dashboard.${tab}`;
            if (!newPermissions.includes(subPermission)) {
              newPermissions.push(subPermission);
            }
          });
        } else {
          // Remove dashboard e todas as subpermissões
          newPermissions = newPermissions.filter(p => 
            !p.startsWith('dashboard.') && p !== 'dashboard'
          );
        }
      } else if (routeId.startsWith('dashboard.')) {
        const isSubPermissionEnabled = prev.includes(routeId);
        
        if (!isSubPermissionEnabled) {
          // Adiciona a subpermissão
          newPermissions.push(routeId);
          // Sempre mantém o dashboard principal quando houver qualquer subpermissão
          if (!newPermissions.includes('dashboard')) {
            newPermissions.push('dashboard');
          }
        } else {
          // Remove a subpermissão
          newPermissions = newPermissions.filter(p => p !== routeId);
          
          // Verifica se ainda existe alguma subpermissão
          const hasAnySubPermission = dashboardTabs.some(tab => 
            newPermissions.includes(`dashboard.${tab}`)
          );
          
          // Remove o dashboard principal apenas se não houver mais nenhuma subpermissão
          if (!hasAnySubPermission) {
            newPermissions = newPermissions.filter(p => p !== 'dashboard');
          }
        }

        // Garante que todas as subpermissões existentes permaneçam
        newPermissions = expandDashboardPermissions(newPermissions);
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
      // Garante que as permissões estão consistentes antes de salvar
      const finalPermissions = tempPermissions.includes('dashboard') 
        ? expandDashboardPermissions(tempPermissions)
        : tempPermissions;

      const updatedUser = {
        ...user,
        permissions: finalPermissions
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
