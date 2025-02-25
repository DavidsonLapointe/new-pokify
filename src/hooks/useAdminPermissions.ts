
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { availableAdminRoutePermissions } from '@/types/admin-permissions';

export const useAdminPermissions = () => {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user) {
      setTempPermissions(user.permissions || {});
    } else {
      setTempPermissions({});
    }
  }, [user]);

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

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedPermissions = { ...tempPermissions, profile: true };
      setTempPermissions(updatedPermissions);
      setSaving(false);
      return updatedPermissions;
    } catch (error) {
      setSaving(false);
      throw error;
    }
  };

  return {
    saving,
    tempPermissions,
    hasPermission,
    handlePermissionChange,
    handleSave
  };
};
