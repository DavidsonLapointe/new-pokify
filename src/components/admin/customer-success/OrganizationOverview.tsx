
import { useState } from "react";
import { Organization } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileText, ChevronUp, ClipboardList } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrganizationOverviewProps {
  organization: Organization;
  onOpenNotes?: () => void;
}

export const OrganizationOverview = ({ organization, onOpenNotes }: OrganizationOverviewProps) => {
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
    
    return planName || "Plano não especificado";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="p-5 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <CardTitle>{organization.name}</CardTitle>
            {getStatusBadge(organization.status)}
            
            {onOpenNotes && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="ml-2 p-0 h-16 w-16" 
                      onClick={onOpenNotes}
                    >
                      <div className="text-primary w-16 h-16 flex items-center justify-center">
                        <ClipboardList className="w-12 h-12" strokeWidth={1.25} />
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Anotações de Customer Success</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Plano:</span>
              <Badge 
                className="bg-[#7E69AB] text-white hover:bg-[#6E59A5] border-0 font-medium px-2.5 py-1"
              >
                {getPlanDisplay()}
              </Badge>
            </div>
            
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="mt-2 sm:mt-0 bg-[#F1F1F1] text-primary hover:bg-[#E5E5E5] border-0"
            >
              {showMoreDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Ocultar dados cadastrais
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-1" />
                  Dados cadastrais
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mt-2 items-start sm:items-center gap-y-1 sm:gap-x-4">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Cliente desde</span>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          
          {organization.pendingReason && (
            <Badge variant="outline" className="mt-1 sm:mt-0">
              {getPendingReason(organization.pendingReason)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {showMoreDetails && (
        <CardContent className="pt-4 border-t">
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
