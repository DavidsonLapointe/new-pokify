
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
import { User, UserStatus } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
  // Estado original do usuário
  const [originalUser, setOriginalUser] = useState(user);
  // Estados temporários para as alterações
  const [pendingEmail, setPendingEmail] = useState(user.email);
  const [pendingPhone, setPendingPhone] = useState(user.phone);
  const [pendingStatus, setPendingStatus] = useState<UserStatus | undefined>(undefined);

  useEffect(() => {
    setOriginalUser(user);
    setPendingEmail(user.email);
    setPendingPhone(user.phone);
    setPendingStatus(undefined);
  }, [user]);

  const handleUpdateUser = () => {
    if (!pendingEmail) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const updatedUser = {
      ...originalUser,
      email: pendingEmail,
      phone: pendingPhone,
      status: pendingStatus || originalUser.status,
      logs: [
        ...originalUser.logs,
        {
          id: Math.max(...originalUser.logs.map(log => log.id)) + 1,
          date: new Date().toISOString(),
          action: "Usuário atualizado"
        }
      ]
    };

    onUserUpdate(updatedUser);
    toast.success("Usuário atualizado com sucesso!");
  };

  const getStatusOptions = () => {
    switch (originalUser.status) {
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

  const getStatusBadgeStyles = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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
              value={originalUser.name}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email*</label>
            <Input
              type="email"
              value={pendingEmail}
              onChange={(e) => setPendingEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              type="tel"
              value={pendingPhone}
              onChange={(e) => setPendingPhone(e.target.value)}
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status atual:</label>
              <Badge
                variant="secondary"
                className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${getStatusBadgeStyles(originalUser.status)}`}
              >
                {getStatusLabel(originalUser.status)}
              </Badge>
            </div>
            <Select
              value={pendingStatus}
              onValueChange={(value: UserStatus) => setPendingStatus(value)}
            >
              <SelectTrigger>
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
          <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
