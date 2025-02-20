
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
  if (!user) return null;

  const [tempChanges, setTempChanges] = useState({
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: "",
  });

  useEffect(() => {
    setTempChanges({
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: "",
    });
  }, [user, isOpen]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusOptions = () => {
    switch (user.status) {
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

  const handleRoleChange = (value: string) => {
    const newRole = value as UserRole;
    setTempChanges({ ...tempChanges, role: newRole });
  };

  const handleSave = () => {
    // Se a função mudou, atualiza as permissões
    const newPermissions = tempChanges.role !== user.role 
      ? DEFAULT_PERMISSIONS[tempChanges.role as keyof typeof DEFAULT_PERMISSIONS]
      : user.permissions;

    const updatedUser: User = {
      ...user,
      email: tempChanges.email,
      phone: tempChanges.phone,
      role: tempChanges.role as UserRole,
      status: tempChanges.status ? (tempChanges.status as "active" | "inactive" | "pending") : user.status,
      permissions: newPermissions
    };

    // Notifica sobre a mudança de permissões se a função foi alterada
    if (tempChanges.role !== user.role) {
      toast.success(`Permissões atualizadas para ${tempChanges.role === 'admin' ? 'Administrador' : 'Vendedor'}`);
    }

    onUserUpdate(updatedUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados do usuário. Alguns campos não podem ser alterados.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input value={user.name} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={tempChanges.email}
              onChange={(e) =>
                setTempChanges({ ...tempChanges, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              type="tel"
              value={tempChanges.phone}
              onChange={(e) =>
                setTempChanges({ ...tempChanges, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select
              value={tempChanges.role}
              onValueChange={handleRoleChange}
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
              <label className="text-sm font-medium">Status Atual:</label>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(user.status)}`}>
                {getStatusLabel(user.status)}
              </span>
            </div>
            <Select
              value={tempChanges.status}
              onValueChange={(value) =>
                setTempChanges({ ...tempChanges, status: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions().map((option) => (
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
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
