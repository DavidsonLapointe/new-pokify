
import { useState } from "react";
import { Organization } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileText, ChevronUp } from "lucide-react";

interface OrganizationOverviewProps {
  organization: Organization;
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  
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

  // Get plan display
  const getPlanDisplay = () => {
    const planName = typeof organization.plan === 'string' 
      ? organization.planName || organization.plan 
      : organization.plan.name;
    
    return (
      <Badge 
        className="bg-[#7E69AB] text-white hover:bg-[#6E59A5] border-0 font-medium px-2.5 py-1"
      >
        {planName}
      </Badge>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <CardTitle>{organization.name}</CardTitle>
            {getStatusBadge(organization.status)}
          </div>
          <Button 
            variant="cancel" 
            size="sm" 
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="flex items-center gap-2 self-start sm:self-center"
          >
            {showMoreDetails ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Ocultar dados cadastrais
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Dados cadastrais
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">Cliente desde {formattedDate}</span>
          <div className="sm:ml-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Plano:</span>
            {getPlanDisplay()}
          </div>
          {organization.pendingReason && (
            <Badge variant="outline" className="sm:ml-2 self-start sm:self-auto">
              {getPendingReason(organization.pendingReason)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {showMoreDetails && (
        <CardContent className="pt-4 border-t mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <h3 className="text-sm font-semibold text-gray-500">Email do Administrador</h3>
              <p className="font-medium">{admin?.email || organization.adminEmail || "Não informado"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Telefone do Administrador</h3>
              <p className="font-medium">{admin?.phone || organization.adminPhone || "Não informado"}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
