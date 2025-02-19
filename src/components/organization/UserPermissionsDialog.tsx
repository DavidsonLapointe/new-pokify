
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
import { availableRoutePermissions, UserRoutePermissions } from "@/types/permissions";
import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

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

  console.log('User permissions when dialog opens:', user.name, user.permissions);

  const { hasRoutePermission, hasTabPermission } = usePermissions(user);
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: string[] }>({}); // Inicializa vazio

  // Atualiza as permissões temporárias quando o modal é aberto ou o usuário muda
  useEffect(() => {
    if (isOpen && user) {
      console.log('Setting initial permissions for:', user.name);
      console.log('Current user permissions:', user.permissions);
      
      // Primeiro inicializa as rotas padrão
      const initialPermissions: { [key: string]: string[] } = {};
      
      // Adiciona rotas padrão
      availableRoutePermissions
        .filter(route => route.isDefault)
        .forEach(route => {
          initialPermissions[route.id] = [];
        });
      
      // Adiciona as permissões específicas do usuário
      if (user.permissions) {
        Object.entries(user.permissions).forEach(([routeId, tabs]) => {
          initialPermissions[routeId] = [...tabs];
        });
      }

      console.log('Initial permissions set to:', initialPermissions);
      setTempPermissions(initialPermissions);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return; // Não permite alterar rotas padrão

    console.log('Changing permission for route:', routeId);
    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      if (newPermissions[routeId]) {
        delete newPermissions[routeId];
      } else {
        newPermissions[routeId] = [];
      }
      console.log('New permissions after change:', newPermissions);
      return newPermissions;
    });
  };

  const handleTabPermissionChange = (routeId: string, tabId: string) => {
    console.log('Changing tab permission:', routeId, tabId);
    setTempPermissions(prev => {
      const currentPermissions = [...(prev[routeId] || [])];
      const tabIndex = currentPermissions.indexOf(tabId);
      
      if (tabIndex > -1) {
        currentPermissions.splice(tabIndex, 1);
      } else {
        currentPermissions.push(tabId);
      }

      const newPermissions = {
        ...prev,
        [routeId]: currentPermissions
      };
      
      console.log('New permissions after tab change:', newPermissions);
      return newPermissions;
    });
  };

  const handleSave = () => {
    setSaving(true);
    try {
      console.log('Saving permissions:', tempPermissions);
      onUserUpdate({
        ...user,
        permissions: tempPermissions,
      });
      onClose();
      toast.success("Permissões atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar permissões");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTempPermissions({}); // Limpa as permissões temporárias
    onClose();
  };

  // Debug render
  console.log('Current temp permissions:', tempPermissions);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Permissões do Usuário</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso para {user.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
          {availableRoutePermissions.map((route) => {
            const isRouteEnabled = route.isDefault || !!tempPermissions[route.id];
            console.log(`Route ${route.id}:`, { 
              isDefault: route.isDefault, 
              hasPermission: !!tempPermissions[route.id],
              isEnabled: isRouteEnabled 
            });
            
            return (
              <div key={route.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={route.id}
                    checked={isRouteEnabled}
                    onChange={() => !route.isDefault && handlePermissionChange(route.id)}
                    disabled={route.isDefault}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={route.id} className="font-medium text-lg">
                    {route.label}
                  </Label>
                </div>

                {route.tabs && isRouteEnabled && (
                  <div className="ml-8 grid grid-cols-2 gap-4">
                    {route.tabs.map((tab) => {
                      const isTabEnabled = (tempPermissions[route.id] || []).includes(tab.id);
                      console.log(`Tab ${tab.id} in route ${route.id}:`, { isEnabled: isTabEnabled });
                      
                      return (
                        <div key={tab.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${route.id}-${tab.id}`}
                            checked={isTabEnabled}
                            onChange={() => handleTabPermissionChange(route.id, tab.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`${route.id}-${tab.id}`}>{tab.label}</Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={saving}>
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
