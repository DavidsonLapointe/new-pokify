
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { availableAdminRoutePermissions } from '@/types/admin-permissions';
import { toast } from 'sonner';

export const useAdminPermissions = (
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
      setTempPermissions(user.permissions || {});
    } else {
      setTempPermissions({});
    }
  }, [isOpen, user]);

  const hasPermission = (routeId: string): boolean => {
    return !!tempPermissions[routeId];
  };

  const handlePermissionChange = (routeId: string) => {
    if (routeId === 'profile') return;

    setTempPermissions(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedUser = {
        ...user,
        permissions: { ...tempPermissions, profile: true }
      };

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
    hasPermission,
    handlePermissionChange,
    handleSave,
    handleClose: onClose,
  };
};
