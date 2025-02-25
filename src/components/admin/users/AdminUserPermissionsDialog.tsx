
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { availableAdminRoutePermissions } from "@/types/admin-permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface AdminUserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export const AdminUserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: AdminUserPermissionsDialogProps) => {
  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      console.log("Initial permissions:", user.permissions);
      setSelectedPermissions(user.permissions || {});
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    if (routeId === 'profile') return;

    setSelectedPermissions(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const handleSave = () => {
    try {
      // Ensure 'profile' permission is always present
      const updatedPermissions = {
        ...selectedPermissions,
        profile: true
      };

      const updatedUser = {
        ...user,
        permissions: updatedPermissions
      };

      // Update current user if it's the same user
      if (user.id === currentUser?.id) {
        updateCurrentUser(updatedUser);
      }

      onUserUpdate(updatedUser);
      toast.success("Permissões atualizadas com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {availableAdminRoutePermissions.map((route) => (
            <div key={route.id} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`section-${route.id}`}
                  checked={selectedPermissions[route.id] ?? false}
                  onCheckedChange={() => handlePermissionChange(route.id)}
                  disabled={route.id === 'profile'}
                />
                <label
                  htmlFor={`section-${route.id}`}
                  className="font-medium"
                >
                  {route.label}
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
