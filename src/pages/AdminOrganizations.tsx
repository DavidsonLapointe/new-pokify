import React, { useState } from "react";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for example organizations
const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Tech Solutions Ltd",
    nomeFantasia: "TechSol",
    plan: "Professional",
    users: [],
    status: "active",
    integratedCRM: "Salesforce",
    integratedLLM: "GPT-4",
    email: "contact@techsol.com",
    phone: "(11) 98765-4321",
    cnpj: "12.345.678/0001-90",
    adminName: "Maria Silva",
    adminEmail: "maria@techsol.com",
    createdAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Global Services Inc",
    nomeFantasia: "GlobalServ",
    plan: "Enterprise",
    users: [],
    status: "pending",
    pendingReason: "contract_signature",
    integratedCRM: null,
    integratedLLM: null,
    email: "info@globalserv.com",
    phone: "(11) 91234-5678",
    cnpj: "98.765.432/0001-10",
    adminName: "João Santos",
    adminEmail: "joao@globalserv.com",
    createdAt: "2024-02-20T14:30:00.000Z"
  },
  {
    id: 3,
    name: "Innovation Labs",
    nomeFantasia: "InnLabs",
    plan: "Professional",
    users: [],
    status: "active",
    integratedCRM: "Hubspot",
    integratedLLM: "GPT-4",
    email: "hello@innlabs.com",
    phone: "(11) 94444-3333",
    cnpj: "45.678.901/0001-23",
    adminName: "Ana Oliveira",
    adminEmail: "ana@innlabs.com",
    createdAt: "2024-03-01T09:15:00.000Z"
  }
];

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleShowActiveUsers = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  const filteredOrganizations = organizations.filter((org) =>
    [org.name, org.nomeFantasia, org.cnpj].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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

  const getIntegrationsInfo = (org: Organization) => {
    const totalIntegrations = 2;
    const completedIntegrations = [org.integratedCRM, org.integratedLLM].filter(Boolean).length;
    
    const getTooltipContent = () => {
      if (completedIntegrations === 0) {
        return "Integrações pendentes: CRM e LLM";
      }

      const integrations = [];
      if (org.integratedCRM) {
        integrations.push(`CRM: ${org.integratedCRM}`);
      } else {
        integrations.push("CRM: Pendente");
      }
      
      if (org.integratedLLM) {
        integrations.push(`LLM: ${org.integratedLLM}`);
      } else {
        integrations.push("LLM: Pendente");
      }

      return integrations.join('\n');
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={completedIntegrations === totalIntegrations ? "secondary" : "default"}
              className="cursor-help"
            >
              {completedIntegrations}/{totalIntegrations}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="whitespace-pre-line">{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getActiveUsersCount = (org: Organization) => {
    return org.users.filter(user => user.status === "active").length;
  };

  return (
    <div className="space-y-8">
      <OrganizationsHeader onCreateNew={() => setIsCreateDialogOpen(true)} />
      
      <OrganizationsSearch 
        value={searchTerm}
        onChange={setSearchTerm}
      />

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
            {filteredOrganizations.map((org) => (
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
                    onClick={() => handleShowActiveUsers(org)}
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
                  {getIntegrationsInfo(org)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditOrganization(org)}
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

      <CreateOrganizationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />

      {editingOrganization && (
        <EditOrganizationDialog
          open={!!editingOrganization}
          onOpenChange={(open) => !open && setEditingOrganization(null)}
          organization={editingOrganization}
        />
      )}

      <Dialog open={!!selectedOrganization} onOpenChange={() => setSelectedOrganization(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuários Ativos - {selectedOrganization?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedOrganization?.users
              .filter(user => user.status === "active")
              .map(user => (
                <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg border">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Organizations;
