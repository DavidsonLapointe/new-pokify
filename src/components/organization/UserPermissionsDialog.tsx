
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";
import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

export const UserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: UserPermissionsDialogProps) => {
  if (!user) return null;

  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const { hasRoutePermission } = usePermissions(user);
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (isOpen && user) {
      setTempPermissions(user.permissions);
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
    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        permissions: tempPermissions,
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {availableRoutePermissions.map((route) => {
            const hasPermissions = Object.keys(tempPermissions).includes(route.id);
            const isRouteEnabled = route.isDefault || hasPermissions;
            const isProfile = route.id === 'profile';
            
            return (
              <div key={route.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={route.id}
                    checked={isRouteEnabled}
                    onChange={() => !route.isDefault && handlePermissionChange(route.id)}
                    disabled={route.isDefault}
                    className={`h-4 w-4 rounded border appearance-none ${
                      isProfile
                        ? 'bg-gray-100 border-gray-200 checked:bg-gray-300 checked:border-gray-300 checked:bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27white%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27%2F%3E%3C%2Fsvg%3E\')]'
                        : 'border-primary checked:bg-primary hover:border-primary/80 checked:bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27white%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27%2F%3E%3C%2Fsvg%3E\')]'
                    }`}
                  />
                  <Label htmlFor={route.id} className="font-medium text-lg">
                    {route.label}
                  </Label>
                </div>

                {route.tabs && (
                  <div className="ml-8 grid grid-cols-2 gap-4">
                    {route.tabs.map((tab) => (
                      <div key={tab.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${route.id}-${tab.id}`}
                          checked={isTabEnabled(route.id, tab.value)}
                          onChange={() => !isProfile && handleTabPermissionChange(route.id, tab.value)}
                          disabled={isProfile}
                          className="h-4 w-4 rounded border appearance-none bg-gray-100 border-gray-200 checked:bg-gray-300 checked:border-gray-300 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27white%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27%2F%3E%3C%2Fsvg%3E')]"
                        />
                        <Label htmlFor={`${route.id}-${tab.id}`}>{tab.label}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="cancel" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
