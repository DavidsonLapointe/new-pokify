
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationLayout from "@/components/OrganizationLayout";
import { CreateLeadDialog } from "@/components/calls/CreateLeadDialog";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Lead } from "@/types/leads";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function OrganizationNewCall() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showIntegrationsAlert, setShowIntegrationsAlert] = useState(false);
  
  // Mock das integrações - em produção isso viria da configuração da empresa
  const hasVoiceIntegration = false;
  const hasLLMIntegration = false;
  const hasEmailIntegration = true;
  const hasPhoneIntegration = true;

  // Mock do usuário e admin - em produção isso viria do contexto de autenticação
  const isAdmin = true; // Simula usuário admin
  const adminContact = {
    name: "João Silva",
    phone: "(11) 98765-4321",
    email: "joao@empresa.com"
  };

  const handleCreateLead = (data: LeadFormData) => {
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: data.firstName,
      lastName: data.lastName,
      contactType: data.contactType,
      contactValue: data.contactValue,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setLeads((current) => [newLead, ...current]);
  };

  const handleStartCall = (lead: Lead) => {
    if (!hasVoiceIntegration || !hasLLMIntegration) {
      setShowIntegrationsAlert(true);
      return;
    }

    // Aqui seria implementada a lógica de iniciar a chamada
    toast({
      title: "Iniciando chamada",
      description: `Conectando com ${lead.firstName} (${lead.contactValue})`,
    });
  };

  // Função para gerar a mensagem do alerta com base nas integrações faltantes
  const getAlertMessage = () => {
    const missingIntegrations = [];
    
    if (!hasVoiceIntegration) {
      missingIntegrations.push("canal de voz");
    }
    
    if (!hasLLMIntegration) {
      missingIntegrations.push("modelo de linguagem (LLM)");
    }

    const baseMessage = missingIntegrations.length === 1
      ? `Para iniciar chamadas, é necessário configurar a integração com ${missingIntegrations[0]}.`
      : `Para iniciar chamadas, é necessário configurar as integrações com ${missingIntegrations.join(" e ")}.`;

    if (isAdmin) {
      return (
        <div className="space-y-4">
          <p>{baseMessage}</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Como administrador, você pode configurar as integrações necessárias na 
              página de integrações do sistema.
            </p>
            <Button 
              variant="default" 
              className="mt-2"
              onClick={() => {
                setShowIntegrationsAlert(false);
                navigate("/organization/integrations");
              }}
            >
              Ir para Integrações
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <p>{baseMessage}</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">Contato do administrador:</p>
            <p className="text-sm">{adminContact.name}</p>
            <p className="text-sm">Tel: {adminContact.phone}</p>
            <p className="text-sm">Email: {adminContact.email}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Efetuar Ligação</h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e gerencie seus leads para iniciar contatos
            </p>
          </div>

          <CreateLeadDialog
            hasPhoneIntegration={hasPhoneIntegration}
            hasEmailIntegration={hasEmailIntegration}
            onCreateLead={handleCreateLead}
          />
        </div>

        <LeadsTable 
          leads={leads}
          onStartCall={handleStartCall}
        />

        <AlertDialog 
          open={showIntegrationsAlert} 
          onOpenChange={setShowIntegrationsAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Configuração Necessária</AlertDialogTitle>
              <AlertDialogDescription asChild>
                {getAlertMessage()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Entendi</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </OrganizationLayout>
  );
}
