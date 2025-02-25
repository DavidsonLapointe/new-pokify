
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
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { availablePermissions, permissionLabels } from "@/types/permissions";

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name || user.email}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Perfil (sempre habilitado) */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="profile"
                checked={true}
                disabled={true}
                className="h-4 w-4 rounded border-primary data-[state=checked]:bg-[#9b87f5]"
              />
              <Label htmlFor="profile" className="text-sm">
                {permissionLabels['profile']}
              </Label>
            </div>

            {/* Dashboard e suas subpermissões */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dashboard"
                  checked={tempPermissions['dashboard'] || false}
                  onCheckedChange={() => handlePermissionChange('dashboard')}
                  className="h-4 w-4 rounded border-primary data-[state=checked]:bg-[#9b87f5]"
                />
                <Label htmlFor="dashboard" className="text-sm">
                  {permissionLabels['dashboard']}
                </Label>
              </div>

              {tempPermissions['dashboard'] && (
                <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                  <div className="grid grid-cols-2 gap-4">
                    {dashboardTabs.map((tab) => (
                      <div key={tab.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dashboard.${tab.id}`}
                          checked={tempPermissions[`dashboard.${tab.id}`] || false}
                          onCheckedChange={() => handlePermissionChange(`dashboard.${tab.id}`)}
                          className="h-4 w-4 rounded border-primary data-[state=checked]:bg-[#9b87f5]"
                        />
                        <Label htmlFor={`dashboard.${tab.id}`} className="text-sm">
                          {permissionLabels[`dashboard.${tab.id}`]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Outras permissões principais */}
            {availablePermissions
              .filter(permission => !['dashboard', 'profile'].includes(permission))
              .map(permission => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={tempPermissions[permission] || false}
                    onCheckedChange={() => handlePermissionChange(permission)}
                    className="h-4 w-4 rounded border-primary data-[state=checked]:bg-[#9b87f5]"
                  />
                  <Label htmlFor={permission} className="text-sm">
                    {permissionLabels[permission]}
                  </Label>
                </div>
              ))}
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
