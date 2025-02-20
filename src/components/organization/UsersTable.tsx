
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
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

  const getLogsCount = (logs: User["logs"]) => {
    return logs.length;
  };

  const getInitials = (name: string) => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const getStatusBadgeClasses = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
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
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
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
                  {user.role === "admin" ? "Administrador" : "Vendedor"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(user.status)}`}
                >
                  {getStatusLabel(user.status)}
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
                  className="px-2 font-medium text-primary hover:text-primary/90"
                  onClick={() => handleViewLogs(user)}
                >
                  {getLogsCount(user.logs)}
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
