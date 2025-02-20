
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
import { User } from "@/types";
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
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      // Inicializa com as permissões atuais do usuário
      setTempPermissions(user.permissions);
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
        if (route?.tabs) {
          newPermissions[routeId] = route.tabs.map(tab => tab.value);
        }
      }
      
      return newPermissions;
    });
  };

  const handleTabPermissionChange = (routeId: string, tabValue: string) => {
    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      const currentPermissions = [...(prev[routeId] || [])];
      const permissionIndex = currentPermissions.indexOf(tabValue);
      
      if (permissionIndex > -1) {
        currentPermissions.splice(permissionIndex, 1);
      } else {
        currentPermissions.push(tabValue);
      }

      if (currentPermissions.length === 0 && !availableRoutePermissions.find(r => r.id === routeId)?.isDefault) {
        delete newPermissions[routeId];
      } else {
        newPermissions[routeId] = currentPermissions;
      }

      return newPermissions;
    });
  };

  const handleSave = () => {
    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        permissions: tempPermissions,
      };

      // Atualiza o localStorage se for o usuário logado
      const mockLoggedUserData = JSON.parse(localStorage.getItem('mockLoggedUser') || '{}');
      if (user.id === mockLoggedUserData.id) {
        localStorage.setItem('mockLoggedUser', JSON.stringify(updatedUser));
        // Força o reload da página para atualizar o menu lateral
        window.location.reload();
      }

      onUserUpdate(updatedUser);
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
    onClose();
  };

  const isTabEnabled = (routeId: string, tabValue: string) => {
    const permissions = tempPermissions[routeId] || [];
    return permissions.includes(tabValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário
          </DialogDescription>
        </DialogHeader>

        <button 
          onClick={() => setShowDebug(prev => !prev)}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2 text-left"
        >
          {showDebug ? "Ocultar Debug" : "Mostrar Debug"}
        </button>

        {showDebug && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
            <div>Nome do usuário: {user.name}</div>
            <div>Permissões atuais: {JSON.stringify(user.permissions, null, 2)}</div>
            <div>Permissões temporárias: {JSON.stringify(tempPermissions, null, 2)}</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {availableRoutePermissions.map((route) => {
            const hasPermissions = Object.keys(tempPermissions).includes(route.id);
            const isRouteEnabled = route.isDefault || hasPermissions;
            
            return (
              <div key={route.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={route.id}
                    checked={isRouteEnabled}
                    onChange={() => !route.isDefault && handlePermissionChange(route.id)}
                    disabled={route.isDefault}
                    className="h-4 w-4 rounded border-gray-300 accent-primary"
                  />
                  <Label htmlFor={route.id} className="font-medium text-lg">
                    {route.label}
                  </Label>
                </div>

                {route.tabs && isRouteEnabled && (
                  <div className="ml-8 grid grid-cols-2 gap-4">
                    {route.tabs.map((tab) => (
                      <div key={tab.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${route.id}-${tab.id}`}
                          checked={isTabEnabled(route.id, tab.value)}
                          onChange={() => handleTabPermissionChange(route.id, tab.value)}
                          className="h-4 w-4 rounded border-gray-300 accent-primary"
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

        <DialogFooter className="mt-4">
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
