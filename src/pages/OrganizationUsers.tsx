
import { useState } from "react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { UsersTable } from "@/components/organization/UsersTable";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserDialog } from "@/components/organization/EditUserDialog";
import { UserPermissionsDialog } from "@/components/organization/UserPermissionsDialog";
import { mockUsers } from "@/types/organization";
import type { User } from "@/types/organization";
import { toast } from "sonner";
import { mockLoggedUser } from "@/components/organization/profile/useProfileForm";

const OrganizationUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleUserAdded = () => {
    toast.success("Usuário adicionado com sucesso!");
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setEditDialogOpen(false);
    toast.success("Usuário atualizado com sucesso!");
  };

  const handlePermissionsUpdated = (updatedUser: User) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );

    // Se o usuário atualizado for o usuário logado, atualiza o localStorage
    if (updatedUser.id === mockLoggedUser.id) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        permissions: updatedUser.permissions
      }));
      // Força o recarregamento da página para atualizar o menu
      window.location.reload();
    }

    setPermissionsDialogOpen(false);
    toast.success("Permissões atualizadas com sucesso!");
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários da sua organização
            </p>
          </div>
          <AddUserDialog onUserAdded={handleUserAdded} />
        </div>

        <UsersTable
          users={users}
          onEditUser={handleEditUser}
          onEditPermissions={handleEditPermissions}
        />

        {selectedUser && (
          <>
            <EditUserDialog
              isOpen={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              user={selectedUser}
              onUserUpdate={handleUserUpdated}
            />
            <UserPermissionsDialog
              isOpen={permissionsDialogOpen}
              onClose={() => setPermissionsDialogOpen(false)}
              user={selectedUser}
              onUserUpdate={handlePermissionsUpdated}
            />
          </>
        )}
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
