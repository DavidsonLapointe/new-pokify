
import { User } from "@/types";
import { availablePermissions } from "@/types/permissions";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const dashboardTabs = [
  'leads', 'uploads', 'performance', 'objections', 'suggestions', 'sellers'
];

export const useUserPermissions = (
  user: User | null,
  isOpen: boolean,
  onClose: () => void,
  onUserUpdate: (user: User) => void
) => {
  const { user: currentUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen && user) {
      // Debug log para verificar as permissões carregadas
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

      // Debug log para verificar as mudanças nas permissões
      console.log('Novas permissões após mudança:', newPermissions);
      return newPermissions;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      // Atualiza as permissões no banco de dados
      const { error } = await supabase
        .from('profiles')
        .update({
          permissions: { ...tempPermissions, profile: true }
        })
        .eq('id', user.id);

      if (error) throw error;

      // Atualiza o usuário localmente
      const updatedUser = {
        ...user,
        permissions: { ...tempPermissions, profile: true }
      };

      onUserUpdate(updatedUser);
      onClose();
      toast.success("Permissões atualizadas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
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
