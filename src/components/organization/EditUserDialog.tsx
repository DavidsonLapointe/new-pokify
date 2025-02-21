
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, UserRole } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

// Definição das permissões padrão por função
const DEFAULT_PERMISSIONS = {
  admin: {
    dashboard: ["leads", "uploads", "performance", "objections", "suggestions", "sellers"],
    leads: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    integrations: ["view", "edit"],
    settings: ["view", "edit"],
    plan: ["view", "upgrade"],
    profile: ["contact", "password"]
  },
  seller: {
    dashboard: ["leads", "uploads"],
    leads: ["view"],
    profile: ["contact", "password"]
  }
};

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
    
    // Atualiza as permissões baseado na nova função
    const newPermissions = DEFAULT_PERMISSIONS[newRole];

    const updatedUser = {
      ...editedUser,
      role: newRole,
      status: pendingStatus ? (pendingStatus as "active" | "inactive" | "pending") : editedUser.status,
      permissions: newPermissions,
      logs: [
        ...editedUser.logs,
        {
          id: Math.max(...editedUser.logs.map(log => log.id)) + 1,
          date: new Date().toISOString(),
          action: `Usuário atualizado${pendingRole ? ` - Função alterada para ${newRole}` : ''}`
        }
      ]
    };

    onUserUpdate(updatedUser);
    toast.success("Usuário atualizado com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary">Ativo</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inativo</Badge>;
      case "pending":
        return <Badge variant="default">Pendente</Badge>;
      default:
        return null;
    }
  };

  const statusOptions = (() => {
    if (!editedUser) return [];
    
    switch (editedUser.status) {
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
  })();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome*</label>
            <Input
              value={editedUser?.name}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email*</label>
            <Input
              type="email"
              value={editedUser?.email}
              onChange={(e) =>
                setEditedUser(prev => prev ? { ...prev, email: e.target.value } : null)
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              type="tel"
              value={editedUser?.phone}
              onChange={(e) =>
                setEditedUser(prev => prev ? { ...prev, phone: e.target.value } : null)
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select
              value={pendingRole || editedUser?.role}
              onValueChange={(value: UserRole) => setPendingRole(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="seller">Vendedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status atual:</label>
              {editedUser?.status && getStatusBadge(editedUser.status)}
            </div>
            <Select 
              value={pendingStatus} 
              onValueChange={setPendingStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
