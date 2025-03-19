
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User, UserRole } from "@/types";
import { useUser } from "@/contexts/UserContext";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddLeadlyEmployeeDialog } from "@/components/admin/users/AddLeadlyEmployeeDialog";
import { EditLeadlyEmployeeDialog } from "@/components/admin/users/EditLeadlyEmployeeDialog";
import { AdminUserPermissionsDialog } from "@/components/admin/users/AdminUserPermissionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatUserData } from "@/utils/userUtils";

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
      // Buscar perfis do tipo leadly_employee e leadly_master
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
          company_leadly_id
        `)
        .or('role.eq.leadly_employee,role.eq.leadly_master');

      if (profilesError) throw profilesError;

      // Formatar todos os usuários Leadly
      const formattedUsers = profiles.map(profile => formatUserData(profile));

      console.log("Usuários Leadly carregados:", formattedUsers);
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
      // For database compatibility, if role is "manager", store it as "admin"
      // This is a temporary solution until the database enum is updated
      let roleForDatabase: string = updatedUser.role;
      
      if (updatedUser.role === "manager") {
        roleForDatabase = "admin";
      }
        
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: roleForDatabase,
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
        <div className="text-left">
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários da Leadly
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Funcionário
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
