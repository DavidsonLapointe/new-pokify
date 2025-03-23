
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
import { UserForm } from "@/components/organization/UserForm";
import { EditUserDialogProps } from "@/components/organization/types";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";

// Define default permissions for different roles
const DEFAULT_PERMISSIONS = {
  admin: ["dashboard", "users", "leads", "settings", "profile"],
  seller: ["dashboard", "leads", "profile"]
};

export const EditUserDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: EditUserDialogProps) => {
  const { user: currentUser } = useUser();
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [pendingRole, setPendingRole] = useState<UserRole | "">("");
  const [pendingArea, setPendingArea] = useState<string>("");

  // Get areas from the OrganizationAreas page
  // This would ideally come from an API or context in a real application
  const defaultAreas = ["Vendas", "Marketing", "Financeiro", "Operações", "Administrativo", "Tecnologia", "Suporte", "Jurídico", "Controladoria", "Logística", "Recursos Humanos", "Contabilidade"];
  
  // In a real application, we would fetch custom areas from the API
  // Based on the current organization's custom created areas
  const customAreas = ["PERA"];
  
  const availableAreas = [...defaultAreas, ...customAreas];

  useEffect(() => {
    setEditedUser(user);
    setPendingStatus("");
    setPendingRole("");
    setPendingArea(user?.area || "");
  }, [user]);

  const handleUpdateUser = () => {
    if (!editedUser) return;

    const newRole = pendingRole || editedUser.role;
    
    // Convert array permissions to object permissions
    const permissionsList = DEFAULT_PERMISSIONS[newRole] || DEFAULT_PERMISSIONS.seller;
    const newPermissions = permissionsList.reduce((acc, permission) => ({
      ...acc,
      [permission]: true
    }), {} as { [key: string]: boolean });

    const updatedUser = {
      ...editedUser,
      role: newRole,
      area: pendingArea || editedUser.area,
      status: pendingStatus ? (pendingStatus as "active" | "inactive" | "pending") : editedUser.status,
      permissions: newPermissions,
      logs: editedUser.logs ? [
        ...editedUser.logs,
        {
          id: editedUser.logs.length > 0 ? 
                String(Math.max(...editedUser.logs.map(log => parseInt(log.id))) + 1) : 
                "1",
          date: new Date().toISOString(),
          action: `Usuário atualizado${pendingRole ? ` - Função alterada para ${newRole}` : ''}`
        }
      ] : [
        {
          id: "1",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  const getAvailableStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "active":
        return [{ value: "inactive", label: "Inativo" }];
      case "inactive":
        return [{ value: "active", label: "Ativo" }];
      case "pending":
        return [
          { value: "active", label: "Ativo" },
          { value: "inactive", label: "Inativo" }
        ];
      default:
        return [];
    }
  };

  const getAvailableRoles = (currentRole: UserRole): { value: UserRole; label: string }[] => {
    switch (currentRole) {
      case "admin":
        return [{ value: "seller", label: "Vendedor" }];
      case "seller":
        return [{ value: "admin", label: "Administrador" }];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário - {user?.name || user?.email}</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          editedUser={editedUser}
          pendingRole={pendingRole}
          pendingStatus={pendingStatus}
          pendingArea={pendingArea}
          onEditUser={handleEditUser}
          onRoleChange={(value: UserRole) => setPendingRole(value)}
          onStatusChange={setPendingStatus}
          onAreaChange={setPendingArea}
          availableStatusOptions={editedUser ? getAvailableStatusOptions(editedUser.status) : []}
          availableRoles={editedUser ? getAvailableRoles(editedUser.role) : []}
          availableAreas={availableAreas}
          currentStatusLabel={
            editedUser ? (
              <div className="flex items-center gap-2">
                Status atual:
                <Badge className={getStatusColor(editedUser.status)}>
                  {getStatusLabel(editedUser.status)}
                </Badge>
              </div>
            ) : null
          }
          currentRole={editedUser?.role}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
