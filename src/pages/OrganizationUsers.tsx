
import { useState } from "react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserDialog } from "@/components/organization/EditUserDialog";
import { UsersTable } from "@/components/organization/UsersTable";
import { User, Organization } from "@/types";

const OrganizationUsers = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockOrganization.users);

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
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
    setIsEditDialogOpen(true);
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
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onUserAdded={handleAddUser}
        />

        {selectedUser && (
          <EditUserDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            user={selectedUser}
            onUserUpdate={handleUserUpdate}
          />
        )}
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
