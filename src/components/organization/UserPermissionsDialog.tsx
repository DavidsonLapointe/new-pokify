
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
import { User, availablePermissions } from "@/types/organization";

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

  const handlePermissionChange = (module: string, permission: string) => {
    const currentPermissions = user.permissions[module] || [];
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];

    onUserUpdate({
      ...user,
      permissions: {
        ...user.permissions,
        [module]: updatedPermissions,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso para {user.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(availablePermissions).map(([module, { label, permissions }]) => (
            <div key={module} className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">{label}</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(permissions).map(([key, description]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${module}-${key}`}
                      checked={user.permissions[module]?.includes(key)}
                      onChange={() => handlePermissionChange(module, key)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${module}-${key}`}>{description}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Salvar Permissões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
