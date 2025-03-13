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
import { OrgUser } from "@/types/organization-types";
import { Mail, PencilIcon, LockIcon, ChevronFirst, ChevronLast } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { UserLogsDialog } from "./UserLogsDialog";

interface UsersTableProps {
  users: OrgUser[];
  onEditUser: (user: OrgUser) => void;
  onEditPermissions: (user: OrgUser) => void;
}

export const UsersTable = ({ users, onEditUser, onEditPermissions }: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleViewLogs = (user: OrgUser) => {
    setSelectedUser(user);
    setLogsDialogOpen(true);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // Gera array de páginas para exibição
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return pages;
  };

  const getLogsCount = (logs: OrgUser["logs"]) => {
    return logs.length;
  };

  const getInitials = (name: string) => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const getStatusBadgeClasses = (status: OrgUser["status"]) => {
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

  const getStatusLabel = (status: OrgUser["status"]) => {
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
    <div className="space-y-4">
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
            {currentUsers.map((user) => (
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
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="default"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0 bg-primary text-white hover:bg-primary/90"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={page}
                variant={currentPage === Number(page) ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(Number(page))}
                className={`w-8 h-8 p-0 ${
                  currentPage === Number(page)
                    ? "bg-[#7E69AB] text-white hover:bg-[#7E69AB]/90"
                    : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#F1F0FB] hover:text-[#9b87f5]"
                }`}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="default"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0 bg-primary text-white hover:bg-primary/90"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      )}

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
