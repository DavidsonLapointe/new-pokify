
import { useState, useEffect } from "react";
import { User } from "@/types";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserDialog } from "@/components/organization/EditUserDialog";
import { UsersTable } from "@/components/organization/UsersTable";
import { UserPermissionsDialog } from "@/components/organization/UserPermissionsDialog";
import { OrganizationUsersHeader } from "@/components/organization/users/OrganizationUsersHeader";
import { useOrganizationUsers } from "@/hooks/useOrganizationUsers";

const OrganizationUsers = () => {
  const { user: currentUser } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { 
    users, 
    loading, 
    fetchOrganizationUsers, 
    updateUser 
  } = useOrganizationUsers(currentUser?.organization?.id);

  // Configurar o listener de realtime
  useEffect(() => {
    if (!currentUser?.organization?.id) return;

    const channel = supabase
      .channel('organization-users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `organization_id=eq.${currentUser.organization.id}`
        },
        (payload) => {
          console.log('Mudança detectada:', payload);
          fetchOrganizationUsers();
        }
      )
      .subscribe();

    fetchOrganizationUsers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.organization?.id]);

  const handleAddUser = () => {
    fetchOrganizationUsers();
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    const success = await updateUser(updatedUser);
    if (success) {
      setIsEditDialogOpen(false);
      setIsPermissionsDialogOpen(false);
    }
  };

  if (!currentUser) {
    return <div>Carregando informações do usuário...</div>;
  }

  return (
    <div className="space-y-8">
      <OrganizationUsersHeader onAddUser={() => setIsAddDialogOpen(true)} />

      {loading ? (
        <div>Carregando usuários...</div>
      ) : (
        <UsersTable
          users={users}
          onEditUser={handleEditUser}
          onEditPermissions={handleEditPermissions}
        />
      )}

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
            onUserUpdate={handleUserUpdate}
          />
        </>
      )}
    </div>
  );
};

export default OrganizationUsers;
