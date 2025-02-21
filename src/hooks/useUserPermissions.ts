
import { User } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

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

      let initialPermissions = { ...user.permissions };

      if (initialPermissions.dashboard?.length > 0) {
        initialPermissions.dashboard = dashboardPermissions;
      }

      if (Object.keys(initialPermissions).includes('plan')) {
        initialPermissions.plan = ['view', 'upgrade'];
      }

      setTempPermissions(initialPermissions);
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

      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedPermissions = { ...tempPermissions };
      if (updatedPermissions.plan && updatedPermissions.plan.length === 0) {
        delete updatedPermissions.plan;
      }

      const updatedUser = {
        ...user,
        permissions: updatedPermissions,
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

  const isTabEnabled = (routeId: string, tabValue: string) => {
    const permissions = tempPermissions[routeId] || [];
    return permissions.includes(tabValue);
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
