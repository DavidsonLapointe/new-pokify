
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { availableAdminRoutePermissions } from "@/types/admin-permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: string[];
  }>(user.permissions || {});

  useEffect(() => {
    setSelectedPermissions(user.permissions || {});
  }, [user]);

  const handlePermissionChange = (routeId: string, tabValue: string) => {
    setSelectedPermissions((prev) => {
      const currentPermissions = prev[routeId] || [];
      const newPermissions = currentPermissions.includes(tabValue)
        ? currentPermissions.filter((p) => p !== tabValue)
        : [...currentPermissions, tabValue];

      return {
        ...prev,
        [routeId]: newPermissions,
      };
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      permissions: selectedPermissions,
      logs: [
        ...user.logs,
        {
          id: Math.max(...user.logs.map((log) => log.id)) + 1,
          date: new Date().toISOString(),
          action: "Permissões atualizadas",
        },
      ],
    };

    onUserUpdate(updatedUser);
    toast.success("Permissões atualizadas com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso do usuário {user.name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {availableAdminRoutePermissions.map((route) => (
              <div key={route.id} className="space-y-3">
                <h3 className="font-medium">{route.label}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {route.tabs?.map((tab) => (
                    <div key={tab.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${route.id}-${tab.id}`}
                        checked={(selectedPermissions[route.id] || []).includes(
                          tab.value
                        )}
                        onCheckedChange={() =>
                          handlePermissionChange(route.id, tab.value)
                        }
                      />
                      <label
                        htmlFor={`${route.id}-${tab.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tab.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
