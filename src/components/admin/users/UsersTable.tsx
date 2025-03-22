
import React from "react";
import { User } from "@/types";
import { Pencil, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onEditPermissions: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEditUser,
  onEditPermissions,
}) => {
  const getRoleLabel = (role: string): string => {
    switch (role) {
      case "leadly_employee":
        return "Funcionário Leadly";
      case "leadly_master":
        return "Mestre Leadly";
      default:
        return "Funcionário Leadly"; // Fallback label
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string): string => {
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
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-medium">Usuário</TableHead>
            <TableHead className="font-medium">Função</TableHead>
            <TableHead className="font-medium text-center">Status</TableHead>
            <TableHead className="font-medium text-center">Data de Cadastro</TableHead>
            <TableHead className="font-medium text-center">Último Acesso</TableHead>
            <TableHead className="font-medium text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getRoleLabel(user.role)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`${getStatusColor(
                    user.status
                  )} hover:${getStatusColor(user.status)}`}
                >
                  {getStatusLabel(user.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-center">
                {user.lastAccess
                  ? new Date(user.lastAccess).toLocaleDateString("pt-BR")
                  : "-"}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditUser(user)}
                    className="text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditPermissions(user)}
                    className="text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Lock className="h-4 w-4" />
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
