
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
      // Primeiro, pega todas as permissões possíveis para o dashboard
      const dashboardRoute = availableRoutePermissions.find(r => r.id === 'dashboard');
      const dashboardPermissions = dashboardRoute?.tabs?.map(tab => tab.value) || [];

      // Garante que todas as rotas e suas permissões estejam inicializadas corretamente
      const initialPermissions: { [key: string]: string[] } = {
        dashboard: dashboardPermissions, // Todas as permissões do dashboard
        leads: ["view", "edit", "delete"],
        users: ["view", "edit", "delete"],
        integrations: ["view", "edit"],
        settings: ["view", "edit"],
        plan: ["view", "upgrade"],
        profile: ["contact", "password"]
      };

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
      // Pega todas as permissões possíveis para o dashboard
      const dashboardRoute = availableRoutePermissions.find(r => r.id === 'dashboard');
      const dashboardPermissions = dashboardRoute?.tabs?.map(tab => tab.value) || [];

      // Garante que todas as permissões estejam presentes ao salvar
      const updatedPermissions = {
        dashboard: tempPermissions.dashboard || dashboardPermissions,
        leads: tempPermissions.leads || ["view", "edit", "delete"],
        users: tempPermissions.users || ["view", "edit", "delete"],
        integrations: tempPermissions.integrations || ["view", "edit"],
        settings: tempPermissions.settings || ["view", "edit"],
        plan: tempPermissions.plan || ["view", "upgrade"],
        profile: ["contact", "password"] // Profile é sempre mantido
      };

      const updatedUser = {
        ...user,
        permissions: updatedPermissions
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
