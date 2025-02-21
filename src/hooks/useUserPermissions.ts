
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
      const dashboardRoute = availableRoutePermissions.find(r => r.id === 'dashboard');
      const dashboardPermissions = dashboardRoute?.tabs?.map(tab => tab.value) || [];

      const planRoute = availableRoutePermissions.find(r => r.id === 'plan');
      const planPermissions = planRoute?.tabs?.map(tab => tab.value) || [];

      // Clona as permissões do usuário e garante que são inicializadas corretamente
      let initialPermissions = { ...user.permissions };

      // Garante que as permissões do dashboard são inicializadas corretamente
      if (user.permissions.dashboard) {
        initialPermissions.dashboard = dashboardPermissions;
      }

      // Garante que as permissões do plano são inicializadas corretamente
      if (user.permissions.plan) {
        initialPermissions.plan = planPermissions;
      }

      // Para todas as outras rotas, mantém as permissões existentes
      availableRoutePermissions.forEach(route => {
        if (route.id !== 'dashboard' && route.id !== 'plan' && user.permissions[route.id]) {
          initialPermissions[route.id] = user.permissions[route.id];
        }
      });

      console.log('Initializing permissions:', initialPermissions);
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
      
      console.log('Permissions after change:', newPermissions);
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

      console.log('Permissions after tab change:', newPermissions);
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
    console.log(`Checking tab ${tabValue} for route ${routeId}:`, isEnabled);
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
