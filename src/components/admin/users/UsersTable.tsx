
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
import { Mail, PencilIcon, LockIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toZonedTime } from 'date-fns-tz';

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onEditPermissions: (user: User) => void;
}

export const UsersTable = ({ users, onEditUser, onEditPermissions }: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const formatDateTime = (dateTimeString: string, showTime: boolean = true) => {
    // Converter UTC para o fuso horário de Brasília
    const timeZone = 'America/Sao_Paulo';
    const utcDate = new Date(dateTimeString);
    const brasiliaDate = toZonedTime(utcDate, timeZone);
    
    const dateFormat = showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
    return format(brasiliaDate, dateFormat, {
      locale: ptBR,
    });
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
            <TableHead>Último Acesso</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-[#9b87f5] text-white">
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
                  {user.role === "leadly_employee" ? "Funcionário Leadly" : 
                   user.role === "admin" ? "Administrador" : "Vendedor"}
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
                {formatDateTime(user.createdAt, false)} {/* Apenas data */}
              </TableCell>
              <TableCell>
                {formatDateTime(user.lastAccess, true)} {/* Data e hora */}
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
    </div>
  );
};
