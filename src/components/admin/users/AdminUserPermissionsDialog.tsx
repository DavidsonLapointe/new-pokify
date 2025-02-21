
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

  const handleSectionPermissionChange = (routeId: string, checked: boolean) => {
    const route = availableAdminRoutePermissions.find(r => r.id === routeId);
    if (!route || routeId === 'profile') return;

    setSelectedPermissions((prev) => {
      if (checked) {
        // Ativa todas as permissões da seção
        return {
          ...prev,
          [routeId]: route.tabs?.map(tab => tab.value) || []
        };
      } else {
        // Remove todas as permissões da seção
        const { [routeId]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handlePermissionChange = (routeId: string, tabValue: string) => {
    if (routeId === 'profile') return; // Não permite alteração para "Meu Perfil"

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

  const isSectionFullyChecked = (routeId: string): boolean => {
    if (routeId === 'profile') return true;
    
    const route = availableAdminRoutePermissions.find(r => r.id === routeId);
    if (!route) return false;

    const currentPermissions = selectedPermissions[routeId] || [];
    return route.tabs?.every(tab => currentPermissions.includes(tab.value)) || false;
  };

  const handleSave = () => {
    // Garante que as permissões do perfil estão sempre presentes
    const profileRoute = availableAdminRoutePermissions.find(r => r.id === 'profile');
    const profilePermissions = profileRoute?.tabs?.map(tab => tab.value) || [];

    const updatedUser = {
      ...user,
      permissions: {
        ...selectedPermissions,
        profile: profilePermissions, // Sempre inclui as permissões do perfil
      },
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
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 h-full">
          <div className="space-y-6">
            {availableAdminRoutePermissions.map((route) => (
              <div key={route.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`section-${route.id}`}
                    checked={isSectionFullyChecked(route.id)}
                    onCheckedChange={(checked) => handleSectionPermissionChange(route.id, checked as boolean)}
                    disabled={route.id === 'profile'}
                    className="h-4 w-4 rounded-[4px] border border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`section-${route.id}`}
                    className="font-medium"
                  >
                    {route.label}
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 ml-6">
                  {route.tabs?.map((tab) => (
                    <div key={tab.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${route.id}-${tab.id}`}
                        checked={
                          route.id === 'profile' || 
                          (selectedPermissions[route.id] || []).includes(tab.value)
                        }
                        onCheckedChange={() =>
                          handlePermissionChange(route.id, tab.value)
                        }
                        disabled={route.id === 'profile'}
                        className="h-4 w-4 rounded-[4px] border border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
