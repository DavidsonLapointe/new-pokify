
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
import { User } from "@/types";
import { toast } from "sonner";
import { mockUsers } from "@/types/mock-users";
import { availableRoutePermissions } from "@/types/permissions";

interface AddLeadlyEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export const AddLeadlyEmployeeDialog = ({ 
  isOpen, 
  onClose, 
  onUserAdded 
}: AddLeadlyEmployeeDialogProps) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newUserId = Math.max(...mockUsers.map(u => u.id)) + 1;
    
    // Define as permissões padrão para usuários leadly_employee
    const userPermissions: { [key: string]: string[] } = {};
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

    const user: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: "leadly_employee",
      status: "pending",
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      permissions: userPermissions,
      logs: [{
        id: 1,
        date: new Date().toISOString(),
        action: "Usuário criado"
      }],
      avatar: "",
      organization: mockUsers[0].organization
    };

    // Simula o envio do email de confirmação
    console.log("Enviando email para:", user.email, "com link de confirmação");
    toast.success("Email de confirmação enviado para " + user.email);

    mockUsers.push(user);
    onUserAdded(user);
    setNewUser({ name: "", email: "", phone: "" });
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
