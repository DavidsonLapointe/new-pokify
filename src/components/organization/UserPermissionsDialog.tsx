
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";
import { PermissionRow } from "./PermissionRow";
import { useUserPermissions } from "@/hooks/useUserPermissions";

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

  const {
    saving,
    tempPermissions,
    handlePermissionChange,
    handleTabPermissionChange,
    handleSave,
    handleClose,
    isTabEnabled,
  } = useUserPermissions(user, isOpen, onClose, onUserUpdate);

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
              <PermissionRow
                key={route.id}
                route={route}
                isRouteEnabled={isRouteEnabled}
                isProfile={isProfile}
                onPermissionChange={handlePermissionChange}
                onTabPermissionChange={handleTabPermissionChange}
                isTabEnabled={isTabEnabled}
              />
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
