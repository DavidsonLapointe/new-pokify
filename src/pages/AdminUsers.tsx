
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User } from "@/types";
import { useUser } from "@/contexts/UserContext";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddLeadlyEmployeeDialog } from "@/components/admin/users/AddLeadlyEmployeeDialog";
import { EditLeadlyEmployeeDialog } from "@/components/admin/users/EditLeadlyEmployeeDialog";
import { AdminUserPermissionsDialog } from "@/components/admin/users/AdminUserPermissionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatUserData, formatOrganizationData } from "@/utils/userUtils";

const AdminUsers = () => {
  const { user } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Buscar todos os perfis
      const { data: profiles, error: profilesError } = await supabase
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
          organization_id,
          company_leadly_id
        `);

      if (profilesError) throw profilesError;

      // Separar perfis em funcionários Leadly e usuários de organizações
      const leadlyEmployees = profiles.filter(profile => profile.role === 'leadly_employee');
      const organizationUsers = profiles.filter(profile => profile.role !== 'leadly_employee');

      // Buscar organizações para os usuários que não são funcionários Leadly
      const organizationIds = [...new Set(organizationUsers.map(user => user.organization_id))];
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', organizationIds);

      if (orgsError) throw orgsError;

      // Criar um mapa de organizações para fácil acesso
      const organizationsMap = new Map(
        organizations?.map(org => [org.id, formatOrganizationData(org)])
      );

      // Formatar todos os usuários
      const formattedUsers = [
        // Formatar funcionários Leadly
        ...leadlyEmployees.map(profile => formatUserData(profile)),
        // Formatar usuários de organizações
        ...organizationUsers.map(profile => 
          formatUserData(profile, organizationsMap.get(profile.organization_id))
        )
      ];

      console.log("Usuários carregados:", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    fetchUsers(); // Recarrega a lista após adicionar
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
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
          permissions: updatedUser.permissions,
          status: updatedUser.status,
          company_leadly_id: updatedUser.company_leadly_id
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso');
      await fetchUsers(); // Recarrega a lista após atualizar
      setIsEditDialogOpen(false);
      setIsPermissionsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários da Leadly
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <UsersTable
        users={users}
        onEditUser={handleEditUser}
        onEditPermissions={handleEditPermissions}
      />

      <AddLeadlyEmployeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onUserAdded={handleAddUser}
      />

      {selectedUser && (
        <>
          <EditLeadlyEmployeeDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            user={selectedUser}
            onUserUpdate={handleUserUpdate}
          />

          <AdminUserPermissionsDialog
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

export default AdminUsers;
