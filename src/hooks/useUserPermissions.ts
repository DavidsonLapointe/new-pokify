
import { User } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

export const useUserPermissions = (
  user: User | null,
  isOpen: boolean,
  onClose: () => void,
  onUserUpdate: (user: User) => void
) => {
  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (isOpen && user) {
      // Inicializa as permissões com as do usuário
      let initialPermissions = { ...user.permissions };

      // Para cada rota, verifica se precisa inicializar
      availableRoutePermissions.forEach(route => {
        // Se o usuário tem permissão para a rota ou é uma rota padrão (profile)
        if (user.permissions[route.id] || route.isDefault) {
          initialPermissions[route.id] = user.permissions[route.id] || [];
          
          // Se for dashboard e tiver pelo menos uma permissão, adiciona todas
          if (route.id === 'dashboard' && user.permissions[route.id]?.length > 0) {
            initialPermissions[route.id] = route.tabs?.map(tab => tab.value) || [];
          }
        }
      });

      console.log('Inicializando permissões:', initialPermissions);
      setTempPermissions(initialPermissions);
    } else {
      setTempPermissions({});
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return;

    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      
      if (newPermissions[routeId]) {
        delete newPermissions[routeId];
      } else {
        if (route?.tabs) {
          newPermissions[routeId] = route.tabs.map(tab => tab.value);
        }
      }
      
      console.log('Permissões após mudança:', newPermissions);
      return newPermissions;
    });
  };

  const handleTabPermissionChange = (routeId: string, tabValue: string) => {
    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      const currentPermissions = [...(prev[routeId] || [])];
      const permissionIndex = currentPermissions.indexOf(tabValue);
      
      if (permissionIndex > -1) {
        currentPermissions.splice(permissionIndex, 1);
      } else {
        currentPermissions.push(tabValue);
      }

      if (currentPermissions.length === 0 && !availableRoutePermissions.find(r => r.id === routeId)?.isDefault) {
        delete newPermissions[routeId];
      } else {
        newPermissions[routeId] = currentPermissions;
      }

      console.log('Permissões após mudança de tab:', newPermissions);
      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        permissions: { ...tempPermissions }
      };

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
    setTempPermissions({});
    onClose();
  };

  const isTabEnabled = (routeId: string, tabValue: string): boolean => {
    const permissions = tempPermissions[routeId] || [];
    const isEnabled = permissions.includes(tabValue);
    console.log(`Verificando tab ${tabValue} para rota ${routeId}:`, isEnabled);
    return isEnabled;
  };

  return {
    saving,
    tempPermissions,
    handlePermissionChange,
    handleTabPermissionChange,
    handleSave,
    handleClose,
    isTabEnabled,
  };
};
