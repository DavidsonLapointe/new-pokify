
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
import { User } from "@/types/organization";
import { availableRoutePermissions } from "@/types/permissions";

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

  const handlePermissionChange = (routeId: string) => {
    const currentPermissions = user.permissions[routeId] || [];
    const hasPermission = currentPermissions.includes("view");
    
    onUserUpdate({
      ...user,
      permissions: {
        ...user.permissions,
        [routeId]: hasPermission ? [] : ["view"],
      },
    });
  };

  const handleTabPermissionChange = (routeId: string, tabId: string) => {
    const currentPermissions = user.permissions[routeId] || [];
    const updatedPermissions = currentPermissions.includes(tabId)
      ? currentPermissions.filter((p) => p !== tabId)
      : [...currentPermissions, tabId];

    onUserUpdate({
      ...user,
      permissions: {
        ...user.permissions,
        [routeId]: updatedPermissions,
      },
    });
  };

  const hasRoutePermission = (routeId: string) => {
    return (user.permissions[routeId] || []).includes("view");
  };

  const hasTabPermission = (routeId: string, tabId: string) => {
    return (user.permissions[routeId] || []).includes(tabId);
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
          {availableRoutePermissions.map((route) => (
            <div key={route.id} className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={route.id}
                  checked={route.isDefault || hasRoutePermission(route.id)}
                  onChange={() => !route.isDefault && handlePermissionChange(route.id)}
                  disabled={route.isDefault}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor={route.id} className="font-medium text-lg">
                  {route.label}
                </Label>
              </div>

              {route.tabs && hasRoutePermission(route.id) && (
                <div className="ml-8 grid grid-cols-2 gap-4">
                  {route.tabs.map((tab) => (
                    <div key={tab.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${route.id}-${tab.id}`}
                        checked={hasTabPermission(route.id, tab.id)}
                        onChange={() => handleTabPermissionChange(route.id, tab.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`${route.id}-${tab.id}`}>{tab.label}</Label>
                    </div>
                  ))}
                </div>
              )}
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
