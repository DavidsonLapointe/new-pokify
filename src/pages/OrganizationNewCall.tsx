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

const initialLeads: Lead[] = [
  {
    id: "1",
    firstName: "João",
    lastName: "Silva",
    contactType: "phone",
    contactValue: "(11) 98765-4321",
    status: "pending",
    createdAt: "2024-03-15T10:00:00.000Z",
    callCount: 0,
    calls: []
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Santos",
    contactType: "phone",
    contactValue: "(11) 91234-5678",
    status: "pending",
    createdAt: "2024-03-14T14:30:00.000Z",
    callCount: 0,
    calls: []
  },
  {
    id: "3",
    firstName: "Pedro",
    lastName: "Oliveira",
    contactType: "phone",
    contactValue: "(11) 97777-8888",
    status: "contacted",
    createdAt: "2024-03-13T09:15:00.000Z",
    callCount: 3,
    calls: [
      { id: "c1", date: "2024-03-13T09:30:00.000Z", duration: "5:30", status: "success" },
      { id: "c2", date: "2024-03-14T11:20:00.000Z", duration: "3:45", status: "success" },
      { id: "c3", date: "2024-03-15T14:00:00.000Z", duration: "4:15", status: "success" }
    ],
    crmInfo: {
      funnel: "Vendas",
      stage: "Qualificação"
    }
  },
  {
    id: "4",
    firstName: "Ana",
    lastName: "Pereira",
    contactType: "phone",
    contactValue: "(11) 95555-6666",
    status: "contacted",
    createdAt: "2024-03-12T16:45:00.000Z",
    callCount: 8,
    calls: [
      { id: "c4", date: "2024-03-12T17:00:00.000Z", duration: "6:20", status: "success" },
      { id: "c5", date: "2024-03-13T10:30:00.000Z", duration: "4:50", status: "failed" },
      { id: "c6", date: "2024-03-13T14:15:00.000Z", duration: "7:30", status: "success" },
      { id: "c7", date: "2024-03-14T09:00:00.000Z", duration: "5:15", status: "success" },
      { id: "c8", date: "2024-03-14T16:30:00.000Z", duration: "3:45", status: "success" },
      { id: "c9", date: "2024-03-15T11:20:00.000Z", duration: "4:30", status: "success" },
      { id: "c10", date: "2024-03-15T15:45:00.000Z", duration: "6:10", status: "success" },
      { id: "c11", date: "2024-03-15T17:00:00.000Z", duration: "5:20", status: "success" }
    ],
    crmInfo: {
      funnel: "Vendas",
      stage: "Proposta"
    }
  },
  {
    id: "5",
    firstName: "Carlos",
    lastName: "Rodrigues",
    contactType: "phone",
    contactValue: "(11) 93333-4444",
    status: "contacted",
    createdAt: "2024-03-10T08:30:00.000Z",
    callCount: 15,
    calls: Array.from({ length: 15 }, (_, i) => ({
      id: `c${i + 12}`,
      date: new Date(2024, 2, 10 + Math.floor(i/3), 9 + (i % 8), 0, 0).toISOString(),
      duration: `${4 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      status: Math.random() > 0.2 ? "success" : "failed"
    })),
    crmInfo: {
      funnel: "Vendas",
      stage: "Fechamento"
    }
  }
];

export default function OrganizationNewCall() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
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
      contactType: data.phone ? "phone" : "email",
      contactValue: data.phone || data.email || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      callCount: 0,
      calls: [],
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
