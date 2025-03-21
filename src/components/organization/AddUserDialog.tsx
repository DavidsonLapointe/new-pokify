
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
import { toast } from "sonner";
import { UserRole } from "@/types";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export const AddUserDialog = ({ isOpen, onClose, onUserAdded }: AddUserDialogProps) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "seller" as UserRole,
    area: "",
  });

  // Get areas from the OrganizationAreas page
  // This would ideally come from an API or context in a real application
  const defaultAreas = ["Vendas", "Marketing", "Financeiro", "Operações", "Administrativo", "Tecnologia", "Suporte", "Jurídico", "Controladoria", "Logística", "Recursos Humanos", "Contabilidade"];
  
  // In a real application, we would fetch custom areas from the API
  // For now, we'll add one example custom area
  const customAreas = ["PERA"];
  
  const availableAreas = [...defaultAreas, ...customAreas];

  const handleAddUser = () => {
    // TODO: Implementar integração com a API
    console.log("Novo usuário:", newUser);
    toast.success("Usuário adicionado com sucesso!");
    onClose();
    setNewUser({ name: "", email: "", phone: "", role: "seller", area: "" });
    onUserAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário. Um email de convite será enviado
            para acesso à plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input
              placeholder="Nome completo"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="email@empresa.com"
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
            <label className="text-sm font-medium">Área</label>
            <Select
              value={newUser.area}
              onValueChange={(value) =>
                setNewUser({ ...newUser, area: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {availableAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select
              value={newUser.role}
              onValueChange={(value: UserRole) =>
                setNewUser({ ...newUser, role: value })
              }
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button onClick={handleAddUser}>Adicionar Usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
