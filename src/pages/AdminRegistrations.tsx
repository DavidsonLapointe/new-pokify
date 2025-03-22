import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { OrganizationsTable } from "@/components/admin/organizations/OrganizationsTable";
import { ActiveUsersDialog } from "@/components/admin/organizations/ActiveUsersDialog";
import { toast } from "sonner";
import { OrganizationsLoadingState } from "@/components/admin/organizations/OrganizationsLoadingState";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Organization, User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddLeadlyEmployeeDialog } from "@/components/admin/users/AddLeadlyEmployeeDialog";
import { EditLeadlyEmployeeDialog } from "@/components/admin/users/EditLeadlyEmployeeDialog";
import { AdminUserPermissionsDialog } from "@/components/admin/users/AdminUserPermissionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { mockLeadlyEmployees } from "@/mocks/userMocks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const AdminRegistrations = () => {
  // State for organizations tab
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  
  // State for users tab
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Fetch organizations data
  const { organizations, isLoading, error, refetch } = useOrganizations();

  const handleEditOrganization = (organization: Organization) => {
    console.log("Editando organização:", organization);
    setEditingOrganization(organization);
  };

  const handleUpdateOrganization = async (updatedOrg: Organization) => {
    try {
      console.log("Atualizando organização:", updatedOrg);
      
      setEditingOrganization(null);
      await refetch();
      toast.success("Empresa atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao processar atualização da organização:", err);
      toast.error("Erro ao atualizar empresa");
    }
  };

  const handleShowActiveUsers = (organization: Organization) => {
    console.log("Mostrando usuários ativos para:", organization.name);
    setSelectedOrganization(organization);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  // Garante que organizações esteja definido antes de filtrar
  const filteredOrganizations = organizations ? organizations.filter((org) =>
    [org.name, org.nomeFantasia, org.cnpj].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  // Users tab functions
  const fetchUsers = () => {
    try {
      setLoadingUsers(true);
      // Obter os 2 funcionários Leadly existentes dos mocks
      let mockUsers = [...mockLeadlyEmployees];
      
      // Gerar mais 13 funcionários Leadly para chegar a um total de 15
      for (let i = 0; i < 13; i++) {
        const id = `l${i + 3}`; // l3, l4, l5, etc. (já que l1 e l2 já existem)
        const role = i % 3 === 0 ? "leadly_master" as UserRole : "leadly_employee" as UserRole;
        
        const newUser: User = {
          id,
          name: `Funcionário Leadly ${i + 3}`,
          email: `employee${i + 3}@leadly.ai`,
          phone: `+55119999${String(i).padStart(5, '0')}`,
          role: role,
          status: i % 5 === 0 ? "inactive" : i % 7 === 0 ? "pending" : "active",
          createdAt: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString(), // Diferentes datas de criação
          lastAccess: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)).toISOString(), // Diferentes datas de último acesso
          permissions: {
            dashboard: true,
            organizations: i % 2 === 0,
            users: i % 3 === 0,
            modules: i % 2 === 0,
            plans: i % 4 === 0,
            "credit-packages": i % 3 === 0,
            financial: i % 5 === 0,
            integrations: i % 2 === 0,
            prompt: i % 3 === 0,
            settings: i % 4 === 0,
            profile: true
          },
          logs: [
            {
              id: "1",
              date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
              action: "Usuário fez login"
            }
          ],
          avatar: null,
          company_leadly_id: "leadly1"
        };
        
        mockUsers.push(newUser);
      }

      console.log("Usuários Leadly carregados:", mockUsers);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Chamar a função fetchUsers quando o componente for montado
  useEffect(() => {
    // Verifica se a tab atual é "usuarios" baseado na URL ou outra lógica
    // e só carrega os usuários se necessário
    fetchUsers();
  }, []); // Array vazio para executar apenas uma vez na montagem

  const handleAddUser = () => {
    fetchUsers(); // Recarrega a lista após adicionar
    setIsAddUserDialogOpen(false);
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
      // Para compatibilidade com o banco de dados, se a função for "manager", armazene-a como "admin"
      // Isso é uma solução temporária até que o enum do banco de dados seja atualizado
      let roleForDatabase: string | UserRole = updatedUser.role;
      
      if (updatedUser.role === "manager") {
        roleForDatabase = "admin";
      }
        
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: roleForDatabase as any, // Use type assertion for database compatibility
          permissions: updatedUser.permissions,
          status: updatedUser.status,
          company_leadly_id: updatedUser.company_leadly_id
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso');
      
      // Atualiza o usuário na lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      setIsEditUserDialogOpen(false);
      setIsPermissionsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro 1</h1>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="areas" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="areas">Áreas</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="funcoes">Funções por tipo de usuário</TabsTrigger>
              <TabsTrigger value="minha-empresa">Minha Empresa</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="areas">
              <CardTitle>Áreas</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="empresas">
              <CardTitle>Empresas</CardTitle>
              <CardContent className="pt-4 px-0">
                <div className="space-y-8">
                  <OrganizationsHeader onCreateNew={() => setIsCreateDialogOpen(true)} />
                  
                  <OrganizationsSearch 
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />

                  <OrganizationsLoadingState
                    isLoading={isLoading}
                    error={error as Error | null}
                    refetch={refetch}
                    isEmpty={!organizations || organizations.length === 0}
                    onCreateNew={() => setIsCreateDialogOpen(true)}
                  />

                  {!isLoading && !error && organizations && organizations.length > 0 && (
                    <OrganizationsTable 
                      organizations={filteredOrganizations}
                      onEditOrganization={handleEditOrganization}
                      onShowActiveUsers={handleShowActiveUsers}
                    />
                  )}

                  <CreateOrganizationDialog 
                    open={isCreateDialogOpen} 
                    onOpenChange={setIsCreateDialogOpen}
                    onSuccess={handleCreateSuccess}
                  />

                  {editingOrganization && (
                    <EditOrganizationDialog
                      open={!!editingOrganization}
                      onOpenChange={(open) => !open && setEditingOrganization(null)}
                      organization={editingOrganization}
                      onSave={handleUpdateOrganization}
                    />
                  )}

                  <ActiveUsersDialog
                    organization={selectedOrganization}
                    onClose={() => setSelectedOrganization(null)}
                  />
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="funcoes">
              <CardTitle>Funções por tipo de usuário</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="minha-empresa">
              <CardTitle>Minha Empresa</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="usuarios">
              <CardTitle>Usuários</CardTitle>
              <CardContent className="pt-4 px-0">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h2 className="text-xl font-bold">Usuários</h2>
                      <p className="text-muted-foreground">
                        Gerencie os funcionários da Leadly
                      </p>
                    </div>
                    <Button onClick={() => setIsAddUserDialogOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Novo Funcionário
                    </Button>
                  </div>

                  {loadingUsers ? (
                    <div>Carregando usuários...</div>
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
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
