
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

  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  // Format pending reason
  const getPendingReason = (reason: string | null) => {
    if (!reason) return null;
    
    switch (reason) {
      case 'contract_signature':
        return 'Assinatura de contrato pendente';
      case 'user_validation':
        return 'Validação de usuário pendente';
      case 'mensalidade_payment':
        return 'Pagamento de mensalidade pendente';
      case 'pro_rata_payment':
        return 'Pagamento pro-rata pendente';
      default:
        return 'Motivo desconhecido';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {organization.name}
          {getStatusBadge(organization.status)}
        </CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span>Cliente desde {formattedDate}</span>
          {organization.pendingReason && (
            <Badge variant="outline" className="sm:ml-2">
              {getPendingReason(organization.pendingReason)}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <h3 className="text-sm font-semibold text-gray-500">Módulos</h3>
          <p className="font-medium">
            {Array.isArray(organization.modules) 
              ? organization.modules.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ') 
              : organization.modules || 'Nenhum'}
          </p>
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
          <h3 className="text-sm font-semibold text-gray-500">Total de Usuários</h3>
          <p className="font-medium">{organization.users?.length || 0}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Administrador</h3>
          <p className="font-medium">{admin?.name || organization.adminName || "Não definido"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Email do Administrador</h3>
          <p className="font-medium">{admin?.email || organization.adminEmail || "Não informado"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Telefone do Administrador</h3>
          <p className="font-medium">{admin?.phone || organization.adminPhone || "Não informado"}</p>
        </div>
      </CardContent>
    </Card>
  );
};
