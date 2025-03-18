
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
import { StatusBadge } from "./dialog-sections/StatusBadge";

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      case "canceled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActiveUsersCount = (org: Organization) => {
    return org.users.filter(user => user.status === "active").length;
  };

  const getPendingSteps = (org: Organization) => {
    const pendingSteps = [];
    
    if (org.contractStatus === "pending") {
      pendingSteps.push("Assinatura de contrato pendente");
    }
    
    if (org.paymentStatus === "pending") {
      pendingSteps.push("Pagamento pro-rata pendente");
    }
    
    if (org.registrationStatus === "pending") {
      pendingSteps.push("Validação de cadastro pendente");
    }
    
    return pendingSteps;
  };

  // Helper function to render plan name safely
  const renderPlanName = (org: Organization) => {
    if (typeof org.plan === 'object' && org.plan !== null) {
      return org.plan.name;
    }
    return org.planName || "Plano não especificado";
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] text-left">Empresa</TableHead>
              <TableHead className="text-left">Plano</TableHead>
              <TableHead className="text-center">Usuários Ativos</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Integrações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="text-left">
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-muted-foreground">{org.nomeFantasia}</p>
                  </div>
                </TableCell>
                <TableCell className="text-left">{renderPlanName(org)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onShowActiveUsers(org)}
                    className="px-2 font-medium text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#F1F0FB]"
                  >
                    {getActiveUsersCount(org)}
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  {org.status === "pending" ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center gap-1">
                          <Badge className={getStatusColor(org.status)}>
                            {org.status === "active" ? "Ativo" :
                             org.status === "pending" ? "Pendente" :
                             org.status === "inactive" ? "Inativo" :
                             org.status === "suspended" ? "Suspenso" :
                             org.status === "canceled" ? "Cancelado" : org.status}
                          </Badge>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium text-sm mb-2">Etapas pendentes:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {getPendingSteps(org).map((step, index) => (
                            <li key={index} className="text-sm">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex justify-center">
                      <StatusBadge status={org.status} />
                    </div>
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
