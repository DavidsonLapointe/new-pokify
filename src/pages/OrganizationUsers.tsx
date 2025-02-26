import { useState } from "react";
import { OrganizationUser } from "@/types";
import { OrganizationUsersHeader } from "@/components/organization/users/OrganizationUsersHeader";
import { OrganizationUsersTable } from "@/components/organization/users/OrganizationUsersTable";
import { InviteUserDialog } from "@/components/organization/users/InviteUserDialog";

const mockUsers: OrganizationUser[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 99999-9999",
    role: "admin",
    status: "active",
    lastAccess: "2024-03-10T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Maria Souza",
    email: "maria@example.com",
    phone: "(11) 98888-8888",
    role: "seller",
    status: "active",
    lastAccess: "2024-03-05T14:30:00.000Z",
  },
  {
    id: "3",
    name: "Carlos Pereira",
    email: "carlos@example.com",
    phone: "(11) 97777-7777",
    role: "seller",
    status: "pending",
  },
];

const OrganizationUsers = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [users, setUsers] = useState<OrganizationUser[]>(mockUsers);

  const handleAddUser = () => {
    setIsInviteDialogOpen(true);
  };

  const handleInviteUser = (newUser: OrganizationUser) => {
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
      <OrganizationUsersTable users={users} />

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleInviteUser}
      />
    </div>
  );
};

export default OrganizationUsers;
