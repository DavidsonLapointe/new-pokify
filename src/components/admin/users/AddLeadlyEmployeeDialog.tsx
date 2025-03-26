import { useState } from "react";
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
import { toast } from "sonner";

interface AddLeadlyEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: Omit<User, 'id'>) => void;
}

export const AddLeadlyEmployeeDialog = ({ isOpen, onClose, onUserAdded }: AddLeadlyEmployeeDialogProps) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "second_brain_employee" as string,
    status: "active" as "active" | "inactive" | "pending",
    permissions: {
      dashboard: true,
      organizations: false,
      users: false,
      modules: false,
      plans: false,
      "credit-packages": false,
      financial: false,
      integrations: false,
      prompt: false,
      settings: false,
      profile: true
    }
  });

  const handleSubmit = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Nome e email são obrigatórios!");
      return;
    }

    // Enviar os dados do novo usuário para o componente pai
    onUserAdded({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as UserRole,
      status: newUser.status,
      permissions: newUser.permissions,
      createdAt: new Date().toISOString(),
      lastAccess: null,
      logs: [],
      avatar: null,
      company_leadly_id: null
    });

    // Limpar o formulário
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "second_brain_employee",
      status: "active",
      permissions: {
        dashboard: true,
        organizations: false,
        users: false,
        modules: false,
        plans: false,
        "credit-packages": false,
        financial: false,
        integrations: false,
        prompt: false,
        settings: false,
        profile: true
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário Leadly. Um email será enviado para confirmação
            de dados e cadastro de senha.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome*</label>
            <Input
              placeholder="Nome completo"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email*</label>
            <Input
              type="email"
              placeholder="email@leadly.com"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              type="tel"
              placeholder="(00) 00000-0000"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select
              value={newUser.role}
              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="second_brain_master">Second Brain Master</SelectItem>
                <SelectItem value="second_brain_employee">Second Brain Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Adicionar Usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
