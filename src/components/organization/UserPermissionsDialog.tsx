
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

const dashboardTabs = [
  { id: 'leads', label: 'Leads' },
  { id: 'uploads', label: 'Uploads' },
  { id: 'performance', label: 'Performance' },
  { id: 'objections', label: 'Objeções' },
  { id: 'suggestions', label: 'Sugestões' },
  { id: 'sellers', label: 'Vendedores' },
];

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
    handleSave,
    handleClose,
  } = useUserPermissions(user, isOpen, onClose, onUserUpdate);

  console.log("Current permissions:", tempPermissions);
  console.log("User permissions:", user.permissions);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {availableRoutePermissions.map((route) => {
              console.log(`Checking route ${route.id}:`, {
                hasPermissions: tempPermissions.includes(route.id),
                tempPermissions
              });

              const hasPermissions = tempPermissions.includes(route.id);
              const isRouteEnabled = route.isDefault || hasPermissions;
              const isProfile = route.id === 'profile';
              
              return (
                <div key={route.id} className="space-y-4">
                  <PermissionRow
                    route={route}
                    isRouteEnabled={isRouteEnabled}
                    isProfile={isProfile}
                    onPermissionChange={handlePermissionChange}
                  />

                  {route.id === 'dashboard' && (
                    <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                      <div className="grid grid-cols-2 gap-4">
                        {dashboardTabs.map((tab) => (
                          <div key={tab.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tab-${tab.id}`}
                              checked={tempPermissions.includes(`dashboard.${tab.id}`)}
                              onCheckedChange={() => handlePermissionChange(`dashboard.${tab.id}`)}
                              className="h-4 w-4 rounded border-primary data-[state=checked]:bg-[#9b87f5]"
                            />
                            <Label htmlFor={`tab-${tab.id}`} className="text-sm">
                              {tab.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

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
