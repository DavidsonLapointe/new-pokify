
import { useState } from "react";
import { User } from "@/types";
import { OrganizationUsersHeader } from "@/components/organization/users/OrganizationUsersHeader";
import { Table } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 99999-9999",
    role: "admin",
    status: "active",
    lastAccess: "2024-03-10T10:00:00.000Z",
    createdAt: "2024-03-01T10:00:00.000Z",
    permissions: {},
    logs: []
  },
  {
    id: "2",
    name: "Maria Souza",
    email: "maria@example.com",
    phone: "(11) 98888-8888",
    role: "seller",
    status: "active",
    lastAccess: "2024-03-05T14:30:00.000Z",
    createdAt: "2024-03-01T10:00:00.000Z",
    permissions: {},
    logs: []
  },
  {
    id: "3",
    name: "Carlos Pereira",
    email: "carlos@example.com",
    phone: "(11) 97777-7777",
    role: "seller",
    status: "pending",
    createdAt: "2024-03-01T10:00:00.000Z",
    permissions: {},
    logs: []
  },
];

const OrganizationUsers = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleAddUser = () => {
    setIsInviteDialogOpen(true);
  };

  const handleInviteUser = (newUser: User) => {
    setUsers([...users, newUser]);
    setIsInviteDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários da sua organização
        </p>
      </div>

      <OrganizationUsersHeader onAddUser={handleAddUser} />

      <div className="border rounded-lg">
        <Table>
          {/* Table content will be implemented later */}
        </Table>
      </div>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
          </DialogHeader>
          {/* Dialog content will be implemented later */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationUsers;

