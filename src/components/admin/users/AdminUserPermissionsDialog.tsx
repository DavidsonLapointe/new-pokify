
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
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions || []);

  useEffect(() => {
    if (isOpen) {
      console.log("Permissões iniciais:", user.permissions);
      setSelectedPermissions(user.permissions || []);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    if (routeId === 'profile') return;

    setSelectedPermissions(prev => {
      if (prev.includes(routeId)) {
        return prev.filter(p => p !== routeId);
      } else {
        return [...prev, routeId];
      }
    });
  };

  const handleSave = () => {
    try {
      // Garante que as rotas padrão estão sempre presentes
      let updatedPermissions = [...selectedPermissions];
      if (!updatedPermissions.includes('profile')) {
        updatedPermissions.push('profile');
      }

      const updatedUser = {
        ...user,
        permissions: updatedPermissions
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
            {availableAdminRoutePermissions.map((route) => (
              <div key={route.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`section-${route.id}`}
                    checked={selectedPermissions.includes(route.id)}
                    onCheckedChange={() => handlePermissionChange(route.id)}
                    disabled={route.id === 'profile'}
                    className={`h-4 w-4 rounded-[4px] border ${
                      route.id === 'profile'
                        ? 'border-gray-300 data-[state=checked]:bg-gray-300'
                        : 'border-primary data-[state=checked]:bg-[#9b87f5]'
                    }`}
                  />
                  <label
                    htmlFor={`section-${route.id}`}
                    className="font-medium"
                  >
                    {route.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="cancel" onClick={onClose}>
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
