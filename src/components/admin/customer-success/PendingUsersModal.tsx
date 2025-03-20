
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  userType: string;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    adminName: string;
    adminEmail: string;
    adminPhone?: string;
  };
}

interface PendingUsersModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingUsers: PendingUser[];
}

export const PendingUsersModal = ({
  isOpen,
  onOpenChange,
  pendingUsers
}: PendingUsersModalProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Usuários com status pendente
          </DialogTitle>
        </DialogHeader>

        {pendingUsers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Não há usuários pendentes no momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data de criação</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Contato admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.organization.name}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{user.organization.adminName}</TableCell>
                    <TableCell>
                      <div>{user.organization.adminEmail}</div>
                      {user.organization.adminPhone && (
                        <div className="text-sm text-muted-foreground">
                          {user.organization.adminPhone}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
