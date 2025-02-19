
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/organization";
import { UserCircle, Mail, PencilIcon, LockIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { UserLogsDialog } from "./UserLogsDialog";

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onEditPermissions: (user: User) => void;
}

export const UsersTable = ({ users, onEditUser, onEditPermissions }: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);

  const handleViewLogs = (user: User) => {
    setSelectedUser(user);
    setLogsDialogOpen(true);
  };

  const getUniqueDaysCount = (logs: User["logs"]) => {
    const uniqueDays = new Set(
      logs.map((log) => new Date(log.date).toDateString())
    );
    return uniqueDays.size;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Qtde de Logs</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize">
                  {user.role === "company_admin" ? "Administrador" : "Vendedor"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status === "active" ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(user.createdAt), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  className="px-2 font-medium"
                  onClick={() => handleViewLogs(user)}
                >
                  {getUniqueDaysCount(user.logs)} dias
                </Button>
              </TableCell>
              <TableCell>
                {format(new Date(user.lastAccess), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditUser(user)}
                  >
                    <PencilIcon className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditPermissions(user)}
                  >
                    <LockIcon className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <UserLogsDialog
          isOpen={logsDialogOpen}
          onClose={() => setLogsDialogOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};
