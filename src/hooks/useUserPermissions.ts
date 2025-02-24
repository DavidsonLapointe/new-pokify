
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
      // Expande as subpermissões do dashboard se necessário
      let initialPermissions = [...(user.permissions || [])];
      if (initialPermissions.includes('dashboard')) {
        dashboardTabs.forEach(tab => {
          if (!initialPermissions.includes(`dashboard.${tab}`)) {
            initialPermissions.push(`dashboard.${tab}`);
          }
        });
      }
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

      // Se for a rota do dashboard
      if (routeId === 'dashboard') {
        const isDashboardEnabled = prev.includes('dashboard');
        
        // Se estiver marcando o dashboard, adiciona todas as subpermissões
        if (!isDashboardEnabled) {
          dashboardTabs.forEach(tab => {
            if (!newPermissions.includes(`dashboard.${tab}`)) {
              newPermissions.push(`dashboard.${tab}`);
            }
          });
          newPermissions.push('dashboard');
        } 
        // Se estiver desmarcando o dashboard, remove todas as subpermissões
        else {
          newPermissions = newPermissions.filter(p => 
            !p.startsWith('dashboard.') && p !== 'dashboard'
          );
        }
      }
      // Se for uma subpermissão do dashboard
      else if (routeId.startsWith('dashboard.')) {
        const isSubPermissionEnabled = prev.includes(routeId);
        
        if (!isSubPermissionEnabled) {
          // Adiciona a subpermissão e garante que o dashboard esteja marcado
          newPermissions.push(routeId);
          if (!newPermissions.includes('dashboard')) {
            newPermissions.push('dashboard');
          }
        } else {
          // Remove a subpermissão
          newPermissions = newPermissions.filter(p => p !== routeId);
          
          // Se não houver mais nenhuma subpermissão, remove o dashboard também
          const hasAnySubPermission = newPermissions.some(p => 
            p.startsWith('dashboard.') && p !== routeId
          );
          
          if (!hasAnySubPermission) {
            newPermissions = newPermissions.filter(p => p !== 'dashboard');
          }
        }
      }
      // Para outras rotas, mantém o comportamento padrão
      else {
        if (prev.includes(routeId)) {
          newPermissions = prev.filter(p => p !== routeId);
        } else {
          newPermissions.push(routeId);
        }
      }

      console.log('Novas permissões:', newPermissions);
      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        permissions: tempPermissions
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
