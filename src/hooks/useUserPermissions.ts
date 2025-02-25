
import { User } from "@/types";
import { availablePermissions } from "@/types/permissions";
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
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen && user) {
      console.log('Permissões atuais do usuário:', user.permissions);
      setTempPermissions(user.permissions || {});
    } else {
      setTempPermissions({});
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    if (routeId === 'profile') return;

    setTempPermissions(prev => {
      const newPermissions = { ...prev };

      if (routeId === 'dashboard') {
        if (!prev['dashboard']) {
          newPermissions['dashboard'] = true;
        } else {
          Object.keys(prev).forEach(key => {
            if (key.startsWith('dashboard.')) {
              delete newPermissions[key];
            }
          });
          delete newPermissions['dashboard'];
        }
      } else if (routeId.startsWith('dashboard.')) {
        const isSubPermissionEnabled = prev[routeId];
        
        if (!isSubPermissionEnabled) {
          newPermissions[routeId] = true;
          newPermissions['dashboard'] = true;
        } else {
          delete newPermissions[routeId];
          
          const hasAnySubPermission = dashboardTabs.some(tab => 
            newPermissions[`dashboard.${tab}`]
          );
          
          if (!hasAnySubPermission) {
            delete newPermissions['dashboard'];
          }
        }
      } else {
        newPermissions[routeId] = !prev[routeId];
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
        permissions: { ...tempPermissions, profile: true }
      };

      console.log('Salvando usuário com permissões:', updatedUser.permissions);

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
    handlePermissionChange,
    handleSave,
    handleClose: onClose,
  };
};
