
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserPermissionsDialogProps } from "@/components/organization/types";

export const UserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: UserPermissionsDialogProps) => {
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize with current user permissions or empty object
    setPermissions(user.permissions || {});
  }, [user]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: checked,
    }));
  };

  const handleSavePermissions = () => {
    const updatedUser = {
      ...user,
      permissions,
      logs: user.logs ? [
        ...user.logs,
        {
          id: user.logs.length > 0 ? 
               String(Math.max(...user.logs.map(log => parseInt(log.id))) + 1) : 
               "1",
          date: new Date().toISOString(),
          action: "Permissões atualizadas",
        },
      ] : [
        {
          id: "1",
          date: new Date().toISOString(),
          action: "Permissões atualizadas",
        }
      ]
    };

    onUserUpdate(updatedUser);
    toast.success("Permissões atualizadas com sucesso!");
  };

  // Define available permissions based on role
  const getAvailablePermissions = () => {
    const basePermissions = [
      { id: "dashboard", label: "Dashboard" },
      { id: "leads", label: "Leads" },
      { id: "calls", label: "Chamadas" },
      { id: "profile", label: "Perfil" },
    ];

    // Add admin-only permissions if needed
    if (user.role === "admin") {
      return [
        ...basePermissions,
        { id: "users", label: "Usuários" },
        { id: "settings", label: "Configurações" },
        { id: "company", label: "Empresa" },
        { id: "integrations", label: "Integrações" },
      ];
    }

    return basePermissions;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permissões - {user.name}</DialogTitle>
          <DialogDescription>
            Configure as permissões deste usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {getAvailablePermissions().map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={permissions[permission.id] || false}
                onCheckedChange={(checked) =>
                  handlePermissionChange(permission.id, checked === true)
                }
              />
              <label
                htmlFor={permission.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.label}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSavePermissions}>Salvar Permissões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
