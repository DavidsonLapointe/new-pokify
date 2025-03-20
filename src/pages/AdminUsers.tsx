
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
import { mockLeadlyEmployees } from "@/mocks/userMocks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const AdminUsers = () => {
  const { user } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      // For demonstration purposes, we'll use mock data
      // In a real environment, we would fetch from the database
      
      // Start with the 2 existing Leadly employees from our mocks
      let mockUsers = [...mockLeadlyEmployees];
      
      // Generate 13 more Leadly employees to reach a total of 15
      for (let i = 0; i < 13; i++) {
        const id = `l${i + 3}`; // l3, l4, l5, etc. (since l1 and l2 already exist)
        const role = i % 3 === 0 ? "leadly_master" as UserRole : "leadly_employee" as UserRole;
        
        const newUser: User = {
          id,
          name: `Funcionário Leadly ${i + 3}`,
          email: `employee${i + 3}@leadly.ai`,
          phone: `+55119999${String(i).padStart(5, '0')}`,
          role: role,
          status: i % 5 === 0 ? "inactive" as "inactive" : i % 7 === 0 ? "pending" as "pending" : "active" as "active",
          createdAt: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString(), // Different creation dates
          lastAccess: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)).toISOString(), // Different last access dates
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

  // Pagination calculations
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
