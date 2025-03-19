
import { Organization } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrganizationOverviewProps {
  organization: Organization;
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  // Encontrar o administrador
  const admin = organization.users?.find(user => user.role === 'admin');
  
  // Formatar data de criação
  const formattedDate = organization.createdAt 
    ? format(new Date(organization.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Data não disponível";

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {organization.name}
          <Badge variant={organization.status === 'active' ? 'success' : 'destructive'}>
            {organization.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Cliente desde {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Plano</h3>
          <p className="font-medium">
            {typeof organization.plan === 'string' 
              ? organization.planName || organization.plan 
              : organization.plan.name}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">CNPJ</h3>
          <p className="font-medium">{organization.cnpj || "Não informado"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Email</h3>
          <p className="font-medium">{organization.email || "Não informado"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Telefone</h3>
          <p className="font-medium">{organization.phone || "Não informado"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Administrador</h3>
          <p className="font-medium">{admin?.name || organization.adminName || "Não definido"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Contato do Administrador</h3>
          <p className="font-medium">{admin?.phone || "Não informado"}</p>
        </div>
      </CardContent>
    </Card>
  );
};
