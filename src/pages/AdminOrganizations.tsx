
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search, Pencil } from "lucide-react";
import { useState } from "react";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";

// Dados mockados para exemplo
const mockOrganizations = [
  {
    id: 1,
    name: "Tech Solutions Ltda",
    nomeFantasia: "Tech Solutions",
    plan: "Enterprise",
    users: 15,
    status: "active",
    integratedCRM: null,
    email: "contato@techsolutions.com",
    phone: "(11) 99999-9999",
    cnpj: "00.000.000/0000-01",
    adminName: "João Silva",
    adminEmail: "joao@techsolutions.com",
  },
  {
    id: 2,
    name: "Vendas Diretas S.A.",
    nomeFantasia: "Vendas Diretas",
    plan: "Professional",
    users: 8,
    status: "active",
    integratedCRM: "Pipedrive",
    email: "contato@vendasdiretas.com",
    phone: "(11) 88888-8888",
    cnpj: "00.000.000/0000-02",
    adminName: "Maria Santos",
    adminEmail: "maria@vendasdiretas.com",
  },
  {
    id: 3,
    name: "Global Comercio",
    nomeFantasia: "Global",
    plan: "Basic",
    users: 3,
    status: "inactive",
    integratedCRM: null,
    email: "contato@global.com",
    phone: "(11) 77777-7777",
    cnpj: "00.000.000/0000-03",
    adminName: "Pedro Costa",
    adminEmail: "pedro@global.com",
  },
];

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations] = useState(mockOrganizations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<any>(null);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const OrganizationCard = ({ organization }: { organization: any }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {organization.name}
            </CardTitle>
            <CardDescription className="mt-1">
              <span className="font-medium text-sm">Plano:</span> {organization.plan}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
            onClick={(e) => {
              e.stopPropagation();
              setEditingOrganization(organization);
            }}
          >
            <Pencil className="w-4 h-4 text-primary hover:text-primary/80" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Usuários</span>
            <span className="font-medium">{organization.users}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">CRM</span>
            <span className={`font-medium ${!organization.integratedCRM ? "text-yellow-600" : ""}`}>
              {organization.integratedCRM || "Pendente de integração"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                organization.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {organization.status === "active" ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Empresas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as empresas contratantes da plataforma
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empresas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
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
      </div>
    </AdminLayout>
  );
};

export default Organizations;
