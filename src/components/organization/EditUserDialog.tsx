
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
import { User } from "@/types";
import { useState, useEffect } from "react";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

export const EditUserDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: EditUserDialogProps) => {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (user) {
      console.log("Usuário recebido no modal:", user);
      setEditedUser(user);
      setSelectedStatus("");
    }
  }, [user]);

  if (!user || !editedUser) return null;

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "secondary";
      case "inactive":
        return "destructive";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const getCurrentStatusLabel = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return "";
    }
  };

  const getRoleLabel = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "seller":
        return "Vendedor";
      case "leadly_employee":
        return "Funcionário Leadly";
      default:
        return "";
    }
  };

  const getAvailableStatusOptions = (currentStatus: User["status"]) => {
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

  const handleSave = () => {
    console.log("Salvando usuário com dados:", editedUser);
    onUserUpdate(editedUser);
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
            <Input value={editedUser.name} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              type="tel"
              value={editedUser.phone}
              onChange={(e) =>
                setEditedUser({ ...editedUser, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select
              value={editedUser.role}
              onValueChange={(value) => {
                console.log("Nova função selecionada:", value);
                setEditedUser({ ...editedUser, role: value as "admin" | "seller" });
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {getRoleLabel(editedUser.role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="seller">Vendedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Status atual:</label>
                <Badge variant={getStatusBadgeVariant(editedUser.status)}>
                  {getCurrentStatusLabel(editedUser.status)}
                </Badge>
              </div>
            </div>
            <Select
              defaultValue=""
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatusOptions(editedUser.status).map((option) => (
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
