
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

  const { hasRoutePermission, hasTabPermission } = usePermissions(user);
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: string[] }>(
    user.permissions || {}
  );

  // Atualiza as permissões temporárias quando o modal é aberto ou o usuário muda
  useEffect(() => {
    if (isOpen && user) {
      const initialPermissions: { [key: string]: string[] } = {};
      
      // Primeiro, verifica todas as rotas que o usuário tem acesso
      availableRoutePermissions.forEach(route => {
        if (route.isDefault || (user.permissions && user.permissions[route.id])) {
          initialPermissions[route.id] = user.permissions?.[route.id] || [];
        }
      });
      
      setTempPermissions(initialPermissions);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return; // Não permite alterar rotas padrão

    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      if (newPermissions[routeId]) {
        delete newPermissions[routeId];
      } else {
        newPermissions[routeId] = [];
      }
      return newPermissions;
    });
  };

  const handleTabPermissionChange = (routeId: string, tabId: string) => {
    setTempPermissions(prev => {
      const currentPermissions = [...(prev[routeId] || [])];
      const tabIndex = currentPermissions.indexOf(tabId);
      
      if (tabIndex > -1) {
        currentPermissions.splice(tabIndex, 1);
      } else {
        currentPermissions.push(tabId);
      }

      return {
        ...prev,
        [routeId]: currentPermissions
      };
    });
  };

  const handleSave = () => {
    setSaving(true);
    try {
      // Filtra as permissões vazias antes de salvar
      const cleanPermissions = Object.entries(tempPermissions).reduce((acc, [key, value]) => {
        if (value.length > 0 || availableRoutePermissions.find(r => r.id === key)?.isDefault) {
          acc[key] = value;
        }
        return acc;
      }, {} as { [key: string]: string[] });

      onUserUpdate({
        ...user,
        permissions: cleanPermissions,
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
    setTempPermissions(user.permissions || {}); // Reset das permissões temporárias
    onClose();
  };

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
            const hasPermission = route.isDefault || (tempPermissions[route.id]?.length >= 0);
            
            return (
              <div key={route.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={route.id}
                    checked={hasPermission}
                    onChange={() => !route.isDefault && handlePermissionChange(route.id)}
                    disabled={route.isDefault}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={route.id} className="font-medium text-lg">
                    {route.label}
                  </Label>
                </div>

                {route.tabs && hasPermission && (
                  <div className="ml-8 grid grid-cols-2 gap-4">
                    {route.tabs.map((tab) => (
                      <div key={tab.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${route.id}-${tab.id}`}
                          checked={(tempPermissions[route.id] || []).includes(tab.id)}
                          onChange={() => handleTabPermissionChange(route.id, tab.id)}
                          className="h-4 w-4 rounded border-gray-300"
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
