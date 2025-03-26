import React, { useState, useEffect } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddLeadlyEmployeeDialog } from "@/components/admin/users/AddLeadlyEmployeeDialog";
import { EditLeadlyEmployeeDialog } from "@/components/admin/users/EditLeadlyEmployeeDialog";
import { AdminUserPermissionsDialog } from "@/components/admin/users/AdminUserPermissionsDialog";
import { supabase } from "@/integrations/supabase/realClient";
import { User } from "@/types";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export const UsuariosTab = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Função auxiliar para mapear os valores do enum do banco para os valores usados no app
  const mapDatabaseRoleToAppRole = (dbRole: string) => {
    const roleMap: Record<string, User["role"]> = {
      'second_brain_master': 'leadly_master',
      'second_brain_employee': 'leadly_employee',
      'organization_admin': 'admin',
      'organization_manager': 'manager',
      'organization_employee': 'user'
    };
    
    return roleMap[dbRole] || 'user';
  };
  
  // Função auxiliar para mapear os valores do app para os valores do enum do banco
  const mapAppRoleToDatabaseRole = (appRole: User["role"]) => {
    const roleMap: Record<string, string> = {
      'leadly_master': 'second_brain_master',
      'leadly_employee': 'second_brain_employee',
      'admin': 'organization_admin',
      'manager': 'organization_manager',
      'user': 'organization_employee'
    };
    
    return roleMap[appRole] || 'organization_employee';
  };
  
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // Simplificando a consulta - primeiro vamos verificar se conseguimos obter dados básicos
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw error;
      }

      if (!profiles) {
        setUsers([]);
        return;
      }

      console.log('Perfis retornados pelo Supabase:', profiles);

      const mappedUsers: User[] = profiles.map(profile => ({
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.tel || '',
        role: mapDatabaseRoleToAppRole(profile.function || 'organization_employee'),
        status: profile.status || 'inactive',
        createdAt: profile.created_at,
        lastAccess: profile.last_login,
        permissions: {
          dashboard: true,
          organizations: profile.function?.includes('master') || profile.function?.includes('admin') || false,
          users: profile.function?.includes('master') || profile.function?.includes('admin') || false,
          modules: profile.function?.includes('master') || profile.function?.includes('admin') || false,
          plans: profile.function?.includes('master') || false,
          "credit-packages": profile.function?.includes('master') || false,
          financial: profile.function?.includes('master') || false,
          integrations: profile.function?.includes('master') || false,
          prompt: true,
          settings: profile.function?.includes('master') || profile.function?.includes('admin') || false,
          profile: true
        },
        logs: [],
        avatar: profile.avatar_url,
        company_leadly_id: profile.organization_id,
        user_id: profile.user_id
      }));

      console.log('Usuários mapeados:', mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      let errorMessage = 'Erro desconhecido';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error(`Erro ao carregar usuários: ${errorMessage}`);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      // Preparando os dados para inserção, respeitando a estrutura da tabela
      const profileData = {
        name: newUser.name,
        email: newUser.email,
        tel: newUser.phone || null,
        function: mapAppRoleToDatabaseRole(newUser.role),
        status: newUser.status || 'inactive',
        // Deixando organization_id como null se não for fornecido
        organization_id: newUser.company_leadly_id || null,
        user_id: newUser.user_id || null,
        created_at: new Date().toISOString()
      };

      console.log("Tentando criar perfil com dados:", profileData);

      // Inserir diretamente sem verificar a tabela
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select();

      if (error) {
        console.error("Detalhes do erro:", error);
        throw error;
      }

      console.log("Usuário criado com sucesso:", data);
      await fetchUsers();
      toast.success('Usuário adicionado com sucesso');
      setIsAddUserDialogOpen(false);
    } catch (error: unknown) {
      // Corrigindo o tipo any para unknown para resolver o erro do linter
      console.error('Erro completo:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: string }).message);
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error(`Erro ao adicionar usuário: ${errorMessage}`);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    try {
      const updateData = {
        name: updatedUser.name,
        email: updatedUser.email,
        tel: updatedUser.phone || null,
        function: mapAppRoleToDatabaseRole(updatedUser.role),
        status: updatedUser.status || 'inactive',
        // Permitir que organization_id seja nulo
        organization_id: updatedUser.company_leadly_id || null,
        // Não incluir user_id na atualização para evitar problemas
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', updatedUser.id);

      if (error) throw error;

      await fetchUsers();
      toast.success('Usuário atualizado com sucesso');
      setIsEditUserDialogOpen(false);
      setIsPermissionsDialogOpen(false);
    } catch (error: unknown) {
      console.error('Erro completo ao atualizar:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: string }).message);
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error(`Erro ao atualizar usuário: ${errorMessage}`);
    }
  };

  // Pagination calculations for users tab
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="px-6">
        <CardTitle className="text-left">Usuários</CardTitle>
        <p className="text-muted-foreground text-left mt-1">
          Gerencie os funcionários da Leadly
        </p>
      </div>
      <CardContent className="pt-4 px-0">
        <div className="space-y-8">
          <div className="flex justify-end px-6">
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Carregando usuários...</span>
            </div>
          ) : (
            <>
              <UsersTable
                users={currentUsers}
                onEditUser={handleEditUser}
                onEditPermissions={handleEditPermissions}
              />

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(currentPage - 1)} 
                        />
                      </PaginationItem>
                    )}
                    
                    {getPageNumbers().map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(currentPage + 1)} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </CardContent>

      <AddLeadlyEmployeeDialog
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onUserAdded={handleAddUser}
      />

      {selectedUser && (
        <>
          <EditLeadlyEmployeeDialog
            isOpen={isEditUserDialogOpen}
            onClose={() => setIsEditUserDialogOpen(false)}
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
    </>
  );
};
