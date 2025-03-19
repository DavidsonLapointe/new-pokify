
import { User, UserStatus } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface UsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  statusFilter: UserStatus | null;
  organizationName?: string;
}

export const UsersDialog = ({ isOpen, onClose, users, statusFilter, organizationName }: UsersDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getStatusVariant = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'seller': return 'Vendedor';
      case 'leadly_employee': return 'Funcionário Leadly';
      case 'leadly_master': return 'Leadly Master';
      case 'manager': return 'Gerente';
      default: return role;
    }
  };
  
  // Calculate pagination data
  const totalPages = Math.ceil(users.length / usersPerPage);
  
  // Get current users
  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return users.slice(indexOfFirstUser, indexOfLastUser);
  }, [users, currentPage, usersPerPage]);
  
  // Change page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Reset to first page when dialog opens or filter changes
  if (!isOpen) {
    if (currentPage !== 1) setCurrentPage(1);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {statusFilter 
              ? `Usuários ${getStatusText(statusFilter).toLowerCase()}s` 
              : 'Todos os usuários'} 
            {organizationName && <span className="text-primary ml-2">- {organizationName}</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[500px] overflow-y-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleText(user.role)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastAccess ? format(new Date(user.lastAccess), 'dd/MM/yyyy HH:mm') : 'Nunca acessou'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {users.length > usersPerPage && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => paginate(currentPage - 1)} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => paginate(currentPage + 1)} 
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
