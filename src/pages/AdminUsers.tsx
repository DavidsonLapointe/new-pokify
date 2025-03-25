import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User } from "@/types";
import { useUser } from "@/contexts/UserContext";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddLeadlyEmployeeDialog } from "@/components/admin/users/AddLeadlyEmployeeDialog";
import { EditLeadlyEmployeeDialog } from "@/components/admin/users/EditLeadlyEmployeeDialog";
import { AdminUserPermissionsDialog } from "@/components/admin/users/AdminUserPermissionsDialog";
import { toast } from "sonner";
import { useUsers } from "@/hooks";
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
  const { 
    users, 
    loading, 
    createUser, 
    updateUser 
  } = useUsers();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      await createUser(newUser);
      toast.success('Usuário adicionado com sucesso');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      toast.error('Erro ao adicionar usuário');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser);
      toast.success('Usuário atualizado com sucesso');
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Carregando usuários...</p>
      </div>
    );
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
