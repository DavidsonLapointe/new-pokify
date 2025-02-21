
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { availableAdminRoutePermissions } from "@/types/admin-permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

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
  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: string[];
  }>(user.permissions || {});

  // Atualiza o estado quando o modal abre ou o usuário muda
  useEffect(() => {
    if (isOpen) {
      console.log("Permissões iniciais:", user.permissions);
      setSelectedPermissions(user.permissions || {});
    }
  }, [isOpen, user]);

  const handleSectionPermissionChange = (routeId: string, checked: boolean) => {
    const route = availableAdminRoutePermissions.find(r => r.id === routeId);
    if (!route || routeId === 'profile') return;

    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      if (checked) {
        // Ativa todas as permissões da seção
        newPermissions[routeId] = route.tabs?.map(tab => tab.value) || [];
      } else {
        // Remove todas as permissões da seção
        delete newPermissions[routeId];
      }
      console.log(`Alterando permissões da seção ${routeId}:`, newPermissions);
      return newPermissions;
    });
  };

  const handlePermissionChange = (routeId: string, tabValue: string) => {
    if (routeId === 'profile') return;

    setSelectedPermissions(prev => {
      const currentPermissions = [...(prev[routeId] || [])];
      const route = availableAdminRoutePermissions.find(r => r.id === routeId);
      
      if (currentPermissions.includes(tabValue)) {
        // Remove a permissão
        const newPermissions = currentPermissions.filter(p => p !== tabValue);
        
        if (newPermissions.length === 0) {
          const { [routeId]: _, ...rest } = prev;
          console.log(`Removendo todas as permissões de ${routeId}`);
          return rest;
        }
        
        return {
          ...prev,
          [routeId]: newPermissions
        };
      } else {
        // Adiciona a permissão
        return {
          ...prev,
          [routeId]: [...currentPermissions, tabValue]
        };
      }
    });
  };

  const isSectionFullyChecked = (routeId: string): boolean => {
    if (routeId === 'profile') return true;
    
    const route = availableAdminRoutePermissions.find(r => r.id === routeId);
    if (!route?.tabs) return false;

    const currentPermissions = selectedPermissions[routeId] || [];
    return route.tabs.every(tab => currentPermissions.includes(tab.value));
  };

  const isSectionPartiallyChecked = (routeId: string): boolean => {
    if (routeId === 'profile') return false;
    
    const route = availableAdminRoutePermissions.find(r => r.id === routeId);
    if (!route?.tabs) return false;

    const currentPermissions = selectedPermissions[routeId] || [];
    const hasAny = route.tabs.some(tab => currentPermissions.includes(tab.value));
    return hasAny && !isSectionFullyChecked(routeId);
  };

  const isTabChecked = (routeId: string, tabValue: string): boolean => {
    return (selectedPermissions[routeId] || []).includes(tabValue);
  };

  const handleSave = () => {
    try {
      // Garante que as permissões do perfil estão sempre presentes
      const profileRoute = availableAdminRoutePermissions.find(r => r.id === 'profile');
      const profilePermissions = profileRoute?.tabs?.map(tab => tab.value) || [];

      const updatedUser = {
        ...user,
        permissions: {
          ...selectedPermissions,
          profile: profilePermissions
        }
      };

      // Se estiver atualizando o usuário atual, atualiza o contexto
      if (user.id === currentUser.id) {
        updateCurrentUser(updatedUser);
      }

      onUserUpdate(updatedUser);
      toast.success("Permissões atualizadas com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    }
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

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {availableAdminRoutePermissions.map((route) => {
              const isFullyChecked = isSectionFullyChecked(route.id);
              const isPartiallyChecked = isSectionPartiallyChecked(route.id);
              
              return (
                <div key={route.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`section-${route.id}`}
                      checked={isFullyChecked || isPartiallyChecked}
                      data-state={isPartiallyChecked ? "indeterminate" : isFullyChecked ? "checked" : "unchecked"}
                      onCheckedChange={(checked) => handleSectionPermissionChange(route.id, checked as boolean)}
                      disabled={route.id === 'profile'}
                      className={`h-4 w-4 rounded-[4px] border ${
                        route.id === 'profile'
                          ? 'border-gray-300 data-[state=checked]:bg-gray-300 data-[state=indeterminate]:bg-gray-300'
                          : 'border-primary data-[state=checked]:bg-[#9b87f5] data-[state=indeterminate]:bg-[#9b87f5]'
                      } data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground`}
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
                          checked={isTabChecked(route.id, tab.value)}
                          onCheckedChange={() => handlePermissionChange(route.id, tab.value)}
                          disabled={route.id === 'profile'}
                          className={`h-4 w-4 rounded-[4px] border ${
                            route.id === 'profile'
                              ? 'border-gray-300 data-[state=checked]:bg-gray-300'
                              : 'border-primary data-[state=checked]:bg-[#9b87f5]'
                          } data-[state=checked]:text-primary-foreground`}
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
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
