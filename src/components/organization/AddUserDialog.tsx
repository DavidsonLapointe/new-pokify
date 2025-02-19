
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/types/organization";
import { mockUsers } from "@/types/organization";
import { availableRoutePermissions } from "@/types/permissions";

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export const AddUserDialog = ({ onUserAdded }: AddUserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "seller" as UserRole,
  });

  const handleAddUser = () => {
    // Cria um novo usuário com ID único
    const newUserId = Math.max(...mockUsers.map(u => u.id)) + 1;
    
    // Gera as permissões baseadas no papel do usuário
    const userPermissions: { [key: string]: string[] } = {};
    
    // Para sellers, adiciona todas as permissões exceto 'plan'
    availableRoutePermissions.forEach(route => {
      if (route.id !== 'profile' && route.id !== 'plan') { // profile já é sempre permitido
        userPermissions[route.id] = route.tabs?.map(tab => tab.value) || [];
      }
    });

    const user = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: "active" as const,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      permissions: userPermissions,
      logs: [],
      avatar: "",
      organization: mockUsers[0].organization // Usa a mesma organização do primeiro usuário
    };

    // Adiciona o novo usuário à lista mockada
    mockUsers.push(user);

    console.log("Novo usuário:", user);
    toast.success("Usuário adicionado com sucesso!");
    setIsOpen(false);
    setNewUser({ name: "", email: "", phone: "", role: "seller" });
    onUserAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddUser}>Adicionar Usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
