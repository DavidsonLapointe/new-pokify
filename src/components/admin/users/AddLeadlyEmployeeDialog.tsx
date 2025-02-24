
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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { UserRole, mockUsers } from "@/types";
import { availableRoutePermissions } from "@/types/permissions";

interface AddLeadlyEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export const AddLeadlyEmployeeDialog = ({ isOpen, onClose, onUserAdded }: AddLeadlyEmployeeDialogProps) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "seller" as UserRole,
  });

  const handleAddUser = () => {
    const lastId = mockUsers.length > 0 
      ? Math.max(...mockUsers.map(u => parseInt(u.id)))
      : 0;
    const newUserId = String(lastId + 1);
    
    const userPermissions: { [key: string]: string[] } = {
      profile: ["contact", "password"]
    };
    
    if (newUser.role === 'admin') {
      const adminRoutes = {
        'dashboard': ['view', 'export'],
        'leads': ['view', 'edit', 'delete'],
        'users': ['view', 'edit', 'delete'],
        'integrations': ['view', 'edit'],
        'settings': ['view', 'edit'],
        'plan': ['view', 'upgrade']
      };
      
      Object.entries(adminRoutes).forEach(([route, permissions]) => {
        userPermissions[route] = permissions;
      });
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
            <Input
              value="Funcionário Leadly"
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddUser}>Adicionar Usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
