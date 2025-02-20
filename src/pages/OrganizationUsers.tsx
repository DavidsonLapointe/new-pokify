
import { useState } from "react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserDialog } from "@/components/organization/EditUserDialog";
import { UsersTable } from "@/components/organization/UsersTable";
import { User, Organization } from "@/types";
import { mockUsers } from "@/types/mock-users";
import { UserPermissionsDialog } from "@/components/organization/UserPermissionsDialog";

const mockOrganization: Organization = {
  id: 1,
  name: "Leadly",
  nomeFantasia: "Leadly",
  plan: "Professional",
  users: mockUsers,
  status: "active",
  integratedCRM: "Salesforce",
  integratedLLM: "GPT-4",
  email: "contato@leadly.com",
  phone: "(11) 99999-9999",
  cnpj: "00.000.000/0000-01",
  adminName: "João Silva",
  adminEmail: "joao@leadly.com",
  createdAt: "2024-01-01T00:00:00.000Z"
};

const OrganizationUsers = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockOrganization.users);

  const handleAddUser = () => {
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários da sua organização
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        <UsersTable
          users={users}
          onEditUser={handleEditUser}
          onEditPermissions={handleEditPermissions}
        />

        <AddUserDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onUserAdded={handleAddUser}
        />

        {selectedUser && (
          <>
            <EditUserDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              user={selectedUser}
              onUserUpdate={handleUserUpdate}
            />

            <UserPermissionsDialog
              isOpen={isPermissionsDialogOpen}
              onClose={() => setIsPermissionsDialogOpen(false)}
              user={selectedUser}
              onPermissionsUpdate={(updatedUser) => {
                const updatedUsers = users.map((user) =>
                  user.id === updatedUser.id ? updatedUser : user
                );
                setUsers(updatedUsers);
                setIsPermissionsDialogOpen(false);
              }}
            />
          </>
        )}
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
