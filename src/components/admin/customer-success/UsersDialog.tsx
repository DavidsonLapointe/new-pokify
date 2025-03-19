
import { User, UserStatus } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface UsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  statusFilter: UserStatus | null;
}

export const UsersDialog = ({ isOpen, onClose, users, statusFilter }: UsersDialogProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {statusFilter ? `Usuários ${getStatusText(statusFilter).toLowerCase()}s` : 'Todos os usuários'}
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
              {users.length > 0 ? (
                users.map((user) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
