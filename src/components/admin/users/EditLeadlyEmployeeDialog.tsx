
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

interface EditLeadlyEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export const EditLeadlyEmployeeDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: EditLeadlyEmployeeDialogProps) => {
  const [editedUser, setEditedUser] = useState(user);
  const [selectedNewStatus, setSelectedNewStatus] = useState<string | null>(null);

  useEffect(() => {
    setEditedUser(user);
    setSelectedNewStatus(null);
  }, [user]);

  const handleUpdateUser = () => {
    if (!editedUser.name || !editedUser.email) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const updatedUser = {
      ...editedUser,
      status: selectedNewStatus as User["status"] || editedUser.status,
      logs: [
        ...editedUser.logs,
        {
          id: Math.max(...editedUser.logs.map(log => log.id)) + 1,
          date: new Date().toISOString(),
          action: "Usuário atualizado"
        }
      ]
    };

    onUserUpdate(updatedUser);
    toast.success("Usuário atualizado com sucesso!");
  };

  const getAvailableStatusOptions = () => {
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
  };

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

  const getCurrentStatusLabel = () => {
    switch (editedUser.status) {
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
              value={editedUser.name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email*</label>
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
            <Input
              value="Funcionário Leadly"
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Status atual:</label>
                <Badge variant={getStatusBadgeVariant(editedUser.status)}>
                  {getCurrentStatusLabel()}
                </Badge>
              </div>
            </div>
            <Select
              value={selectedNewStatus || ""}
              onValueChange={setSelectedNewStatus}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatusOptions().map((option) => (
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
