
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

  const { hasRoutePermission } = usePermissions(user);
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: string[] }>({});
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      const debug = `
        Nome do usuário: ${user.name}
        Permissões atuais: ${JSON.stringify(user.permissions, null, 2)}
      `;
      setDebugInfo(debug);
      
      // Garantir que rotas padrão estejam sempre presentes
      const initialPermissions = { ...(user.permissions || {}) };
      availableRoutePermissions
        .filter(route => route.isDefault)
        .forEach(route => {
          if (!initialPermissions[route.id]) {
            initialPermissions[route.id] = [];
          }
        });
      
      setTempPermissions(initialPermissions);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return;

    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      if (newPermissions[routeId]) {
        delete newPermissions[routeId];
      } else {
        // Quando adiciona uma rota, inicializa com permissão de visualização
        newPermissions[routeId] = ["view"];
      }
      return newPermissions;
    });
  };

  const handleTabPermissionChange = (routeId: string, permission: string) => {
    setTempPermissions(prev => {
      const currentPermissions = [...(prev[routeId] || [])];
      const permissionIndex = currentPermissions.indexOf(permission);
      
      if (permissionIndex > -1) {
        currentPermissions.splice(permissionIndex, 1);
      } else {
        currentPermissions.push(permission);
      }

      // Se não houver mais permissões e não for uma rota padrão, remove a rota
      const route = availableRoutePermissions.find(r => r.id === routeId);
      if (currentPermissions.length === 0 && !route?.isDefault) {
        const { [routeId]: _, ...rest } = prev;
        return rest;
      }

      // Se for uma rota padrão, garantir que ela permaneça no objeto mesmo sem permissões
      if (route?.isDefault) {
        return {
          ...prev,
          [routeId]: currentPermissions
        };
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
      // Garantir que rotas padrão estejam sempre presentes
      const updatedPermissions = { ...tempPermissions };
      availableRoutePermissions
        .filter(route => route.isDefault)
        .forEach(route => {
          if (!updatedPermissions[route.id]) {
            updatedPermissions[route.id] = [];
          }
        });

      onUserUpdate({
        ...user,
        permissions: updatedPermissions,
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
    setTempPermissions({});
    setDebugInfo("");
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

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap">
          {debugInfo}
          <div className="mt-2">
            Permissões temporárias: {JSON.stringify(tempPermissions, null, 2)}
          </div>
        </div>

        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
          {availableRoutePermissions.map((route) => {
            const isRouteEnabled = route.isDefault || Object.keys(tempPermissions).includes(route.id);
            
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
                      const routePermissions = tempPermissions[route.id] || [];
                      const isTabEnabled = routePermissions.includes(tab.value);
                      
                      return (
                        <div key={tab.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${route.id}-${tab.id}`}
                            checked={isTabEnabled}
                            onChange={() => handleTabPermissionChange(route.id, tab.value)}
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
