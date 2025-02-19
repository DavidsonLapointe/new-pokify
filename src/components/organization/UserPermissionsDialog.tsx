
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
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      // Inicializa mantendo as permissões existentes do usuário
      const initialPermissions: { [key: string]: string[] } = { ...user.permissions };
      
      // Remove permissões que não existem mais (como "calls")
      Object.keys(initialPermissions).forEach(routeId => {
        if (!availableRoutePermissions.find(r => r.id === routeId)) {
          delete initialPermissions[routeId];
        }
      });

      // Garante que rotas padrão estejam presentes com suas tabs
      availableRoutePermissions
        .filter(route => route.isDefault)
        .forEach(route => {
          if (route.tabs) {
            initialPermissions[route.id] = route.tabs.map(tab => tab.value);
          }
        });

      // Para o dashboard, se o usuário tem acesso, adiciona todas as tabs
      if (initialPermissions["dashboard"]) {
        const dashboardRoute = availableRoutePermissions.find(r => r.id === "dashboard");
        if (dashboardRoute?.tabs) {
          initialPermissions["dashboard"] = dashboardRoute.tabs.map(tab => tab.value);
        }
      }

      // Adiciona tabs válidas para outras rotas que o usuário já tem acesso
      Object.keys(initialPermissions).forEach(routeId => {
        if (routeId !== "dashboard") { // Pula o dashboard pois já foi tratado
          const route = availableRoutePermissions.find(r => r.id === routeId);
          if (route?.tabs) {
            const validTabs = route.tabs.map(tab => tab.value);
            initialPermissions[routeId] = initialPermissions[routeId].filter(tab => 
              validTabs.includes(tab)
            );
          }
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
      
      // Se já existe a rota, remove ela e suas tabs
      if (newPermissions[routeId]) {
        delete newPermissions[routeId];
      } else {
        // Se não existe, adiciona a rota com todas as suas tabs
        if (route?.tabs) {
          newPermissions[routeId] = route.tabs.map(tab => tab.value);
        } else {
          newPermissions[routeId] = ["view"];
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

      // Se não sobrou nenhuma permissão e não é uma rota padrão, remove a rota completamente
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
      // Assegura que apenas permissões válidas sejam salvas
      const validPermissions: { [key: string]: string[] } = {};
      
      Object.entries(tempPermissions).forEach(([routeId, tabs]) => {
        const route = availableRoutePermissions.find(r => r.id === routeId);
        if (route) {
          const validTabs = route.tabs?.map(tab => tab.value) || [];
          const filteredTabs = tabs.filter(tab => validTabs.includes(tab));
          if (filteredTabs.length > 0) {
            validPermissions[routeId] = filteredTabs;
          }
        }
      });

      const updatedUser = {
        ...user,
        permissions: validPermissions,
      };

      onUserUpdate(updatedUser);
      
      // Força atualização imediata do localStorage se for o usuário logado
      if (user.id === JSON.parse(localStorage.getItem('user') || '{}').id) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedStoredUser = {
          ...storedUser,
          permissions: validPermissions
        };
        localStorage.setItem('user', JSON.stringify(updatedStoredUser));
      }

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
          <DialogTitle>Permissões do Usuário</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso para {user.name}
          </DialogDescription>
        </DialogHeader>

        {/* Debug Toggle */}
        <button 
          onClick={() => setShowDebug(prev => !prev)}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2 text-left"
        >
          {showDebug ? "Ocultar Debug" : "Mostrar Debug"}
        </button>

        {/* Debug Info - Collapsible */}
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
