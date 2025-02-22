
import React from "react";
import { Organization } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationIntegrations } from "./OrganizationIntegrations";

interface OrganizationsTableProps {
  organizations: Organization[];
  onEditOrganization: (organization: Organization) => void;
  onShowActiveUsers: (organization: Organization) => void;
}

export const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  organizations,
  onEditOrganization,
  onShowActiveUsers,
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActiveUsersCount = (org: Organization) => {
    return org.users.filter(user => user.status === "active").length;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Empresa</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Usuários Ativos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Integrações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{org.name}</p>
                  <p className="text-sm text-muted-foreground">{org.nomeFantasia}</p>
                </div>
              </TableCell>
              <TableCell>{org.plan}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => onShowActiveUsers(org)}
                  className="px-2 font-medium text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#F1F0FB]"
                >
                  {getActiveUsersCount(org)}
                </Button>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(org.status)}>
                  {getStatusLabel(org.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(org.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <OrganizationIntegrations organization={org} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditOrganization(org)}
                  className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#F1F0FB]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
