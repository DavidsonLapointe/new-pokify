
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
import { Badge } from "@/components/ui/badge";
import { Pencil, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationIntegrations } from "./OrganizationIntegrations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const getPendingReason = (org: Organization) => {
    if (org.status !== "pending") return null;

    const reasons: { [key: string]: string } = {
      contract_signature: "Aguardando assinatura do contrato",
      payment: "Aguardando confirmação do pagamento",
      pro_rata_payment: "Aguardando pagamento pro-rata",
      user_validation: "Aguardando validação dos dados do usuário",
      approval: "Aguardando aprovação administrativa",
    };

    return reasons[org.pendingReason || ""] || "Status pendente";
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Empresa</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead className="text-center">Usuários Ativos</TableHead>
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
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onShowActiveUsers(org)}
                    className="px-2 font-medium text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#F1F0FB]"
                  >
                    {getActiveUsersCount(org)}
                  </Button>
                </TableCell>
                <TableCell>
                  {org.status === "pending" ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Badge className={getStatusColor(org.status)}>
                            {getStatusLabel(org.status)}
                          </Badge>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium text-sm">Motivo da pendência:</p>
                        <p>{getPendingReason(org)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge className={getStatusColor(org.status)}>
                      {getStatusLabel(org.status)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(org.createdAt), "dd/MM/yyyy")}
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
    </TooltipProvider>
  );
};
