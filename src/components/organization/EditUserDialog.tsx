
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, UserRole } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserForm } from "@/components/admin/users/UserForm";
import { EditUserDialogProps, DEFAULT_PERMISSIONS } from "@/components/admin/users/types";

export const EditUserDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: EditUserDialogProps) => {
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [pendingRole, setPendingRole] = useState<UserRole | "">("");

  useEffect(() => {
    setEditedUser(user);
    setPendingStatus("");
    setPendingRole("");
  }, [user]);

  const handleUpdateUser = () => {
    if (!editedUser) return;

    const newRole = pendingRole || editedUser.role;
    
    // Convert array permissions to object permissions
    const newPermissions = DEFAULT_PERMISSIONS[newRole].reduce((acc, permission) => ({
      ...acc,
      [permission]: true
    }), {} as { [key: string]: boolean });

    const updatedUser = {
      ...editedUser,
      role: newRole,
      status: pendingStatus ? (pendingStatus as "active" | "inactive" | "pending") : editedUser.status,
      permissions: newPermissions,
      logs: [
        ...editedUser.logs,
        {
          id: String(Math.max(...editedUser.logs.map(log => parseInt(log.id))) + 1),
          date: new Date().toISOString(),
          action: `Usuário atualizado${pendingRole ? ` - Função alterada para ${newRole}` : ''}`
        }
      ]
    };

    onUserUpdate(updatedUser);
    toast.success("Usuário atualizado com sucesso!");
  };

  const handleEditUser = (field: string, value: string) => {
    setEditedUser(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          editedUser={editedUser}
          pendingRole={pendingRole}
          pendingStatus={pendingStatus}
          onEditUser={handleEditUser}
          onRoleChange={(value: UserRole) => setPendingRole(value)}
          onStatusChange={setPendingStatus}
        />
        <DialogFooter>
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
