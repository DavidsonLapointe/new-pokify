
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserDialog } from "@/components/organization/EditUserDialog";
import { UsersTable } from "@/components/organization/UsersTable";
import { User } from "@/types";
import { UserPermissionsDialog } from "@/components/organization/UserPermissionsDialog";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OrganizationUsers = () => {
  const { user: currentUser } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar usuários
  const fetchOrganizationUsers = async () => {
    if (!currentUser?.organization?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          phone,
          role,
          status,
          permissions,
          created_at,
          last_access,
          avatar,
          organization_id
        `)
        .eq('organization_id', currentUser.organization.id);

      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Erro ao carregar usuários");
        setLoading(false);
        return;
      }

      if (!profiles) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const formattedUsers: User[] = profiles.map(profile => {
        let formattedPermissions: { [key: string]: boolean } = {};
        
        if (profile.permissions && typeof profile.permissions === 'object') {
          formattedPermissions = Object.entries(profile.permissions).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: Boolean(value)
            }),
            {}
          );
        }

        return {
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          role: profile.role || 'seller',
          status: profile.status || 'active',
          createdAt: profile.created_at,
          lastAccess: profile.last_access || profile.created_at,
          permissions: formattedPermissions,
          logs: [],
          avatar: profile.avatar || '',
          organization: currentUser.organization
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error in fetchOrganizationUsers:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar usuários apenas quando necessário
  useEffect(() => {
    console.log("useEffect em OrganizationUsers - currentUser:", currentUser?.organization?.id);
    if (currentUser?.organization?.id) {
      fetchOrganizationUsers();
    }
  }, [currentUser?.organization?.id]); // Dependência corrigida

  const handleAddUser = () => {
    fetchOrganizationUsers(); // Atualiza a lista após adicionar
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
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          permissions: updatedUser.permissions
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      // Atualiza a lista de usuários
      fetchOrganizationUsers();
      
      setIsEditDialogOpen(false);
      setIsPermissionsDialogOpen(false);
      toast.success("Usuário atualizado com sucesso");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar usuário");
    }
  };

  if (!currentUser) {
    return <div>Carregando informações do usuário...</div>;
  }

  return (
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
          Novo Usuário
        </Button>
      </div>

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
