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
import { UserRole, mockUsers } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";

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
  });

  const handleAddUser = () => {
    const newUserId = Math.max(...mockUsers.map(u => u.id)) + 1;
    
    const userPermissions: { [key: string]: string[] } = {};
    
    if (newUser.role === 'leadly_employee') {
      const adminRoutes = [
        'dashboard',
        'integrations',
        'plans',
        'organizations',
        'settings',
        'prompt',
        'analysis_packages',
        'financial'
      ];
      availableRoutePermissions.forEach(route => {
        if (adminRoutes.includes(route.id)) {
          userPermissions[route.id] = route.tabs?.map(tab => tab.value) || [];
        }
      });
    } else if (newUser.role === 'admin') {
      availableRoutePermissions.forEach(route => {
        if (!['organizations', 'companies', 'analysis_packages', 'financial', 'prompt'].includes(route.id)) {
          userPermissions[route.id] = route.tabs?.map(tab => tab.value) || [];
        }
      });
      userPermissions.users = ['view', 'edit', 'delete'];
    } else if (newUser.role === 'seller') {
      const sellerRoutes = {
        'dashboard': ['view'],
        'leads': ['view', 'edit'],
        'integrations': ['view']
      };
      
      Object.entries(sellerRoutes).forEach(([route, permissions]) => {
        userPermissions[route] = permissions;
      });
    }

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
      organization: mockUsers[0].organization
    };

    mockUsers.push(user);

    console.log("Novo usuário:", user);
    toast.success("Usuário adicionado com sucesso!");
    onClose();
    setNewUser({ name: "", email: "", phone: "", role: "seller" });
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
                <SelectItem value="leadly_employee">Funcionário Leadly</SelectItem>
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
