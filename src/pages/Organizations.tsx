
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
import { Building2, Plus, Search } from "lucide-react";
import { useState } from "react";

// Dados mockados para exemplo
const mockOrganizations = [
  {
    id: 1,
    name: "Tech Solutions Ltda",
    plan: "Enterprise",
    users: 15,
    status: "active",
    integratedCRM: "HubSpot",
  },
  {
    id: 2,
    name: "Vendas Diretas S.A.",
    plan: "Professional",
    users: 8,
    status: "active",
    integratedCRM: "Pipedrive",
  },
  {
    id: 3,
    name: "Global Comercio",
    plan: "Basic",
    users: 3,
    status: "inactive",
    integratedCRM: "Salesforce",
  },
];

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations] = useState(mockOrganizations);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const OrganizationCard = ({ organization }: { organization: any }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {organization.name}
        </CardTitle>
        <CardDescription>Plano: {organization.plan}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usuários</span>
            <span className="font-medium">{organization.users}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CRM</span>
            <span className="font-medium">{organization.integratedCRM}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`font-medium ${
                organization.status === "active"
                  ? "text-green-600"
                  : "text-red-600"
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
          <Button>
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
      </div>
    </AdminLayout>
  );
};

export default Organizations;
