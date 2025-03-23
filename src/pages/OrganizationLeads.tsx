
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CallAnalysisDialog } from "@/components/calls/CallAnalysisDialog";
import { CreateLeadDialog } from "@/components/calls/CreateLeadDialog";
import { UploadCallDialog } from "@/components/calls/UploadCallDialog";
import { FindLeadDialog } from "@/components/calls/FindLeadDialog";
import { statusMap } from "@/constants/callStatus";
import { useCallsPage } from "@/hooks/useCallsPage";
import { useLeadUpload } from "@/hooks/useLeadUpload";
import { LeadsPageHeader } from "@/components/leads/LeadsPageHeader";
import { LeadsPageContent } from "@/components/leads/LeadsPageContent";
import { Toaster } from "@/components/ui/toaster";
import { Call } from "@/types/calls";
import { User } from "@/types/user-types";
import { Organization } from "@/types/organization-types";
import { MonthStats } from "@/types/calls";
import { leadsOrganizacao1 } from "@/mocks/leadsMocks";
import { toast } from "sonner";

// Mock organization specifically for "Organização 1 Ltda."
const mockOrganization: Organization = {
  id: "org-1",
  name: "Organização 1 Ltda.",
  nomeFantasia: "Org 1",
  plan: "enterprise",
  planName: "Enterprise",
  users: [], 
  status: "active" as const,
  pendingReason: null,
  contractStatus: "completed" as const,
  paymentStatus: "completed" as const,
  registrationStatus: "completed" as const,
  integratedCRM: "HubSpot",
  integratedLLM: "OpenAI",
  email: "contato@organizacao1.com.br",
  phone: "(11) 3333-3333",
  cnpj: "12.345.678/0001-90",
  adminName: "João Silva",
  adminEmail: "joao@organizacao1.com.br",
  contractSignedAt: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  logo: "https://ui-avatars.com/api/?name=Org+1&background=random",
  address: {
    logradouro: "Av. Paulista",
    numero: "123",
    complemento: "Sala 45",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01311-000"
  }
};

const mockLoggedUser: User = {
  id: "2",
  name: "Maria Santos",
  email: "maria@organizacao1.com.br",
  phone: "(11) 98888-8888",
  role: "seller" as const,
  status: "active" as const,
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: "2024-03-15T14:30:00.000Z",
  permissions: {
    dashboard: true,
    'dashboard.leads': true,
    leads: true,
    integrations: true,
    profile: true
  },
  logs: [
    {
      id: "1",
      date: "2024-03-15T14:30:00.000Z",
      action: "Acessou o sistema",
    },
  ],
  organization: mockOrganization,
  avatar: "",
};

// Helper function to convert a lead to a call for display
const leadToCall = (lead: any): Call => {
  // Create analysis object for calls that have them
  const hasAnalysis = lead.callCount > 0 && lead.calls && lead.calls.length > 0;
  
  // Determine if the file is a video based on the extension
  const isVideoFile = lead.calls && 
                      lead.calls.length > 0 && 
                      lead.calls[0].fileName?.toLowerCase().endsWith('.mp4');
  
  return {
    id: `call-${lead.id}`,
    leadId: lead.id,
    leadInfo: {
      personType: lead.personType || "pf",
      firstName: lead.firstName,
      lastName: lead.lastName || "",
      razaoSocial: lead.razaoSocial || "",
      email: lead.email || "",
      phone: lead.contactValue || "",
    },
    emptyLead: false,
    date: lead.createdAt,
    duration: lead.calls && lead.calls.length > 0 ? lead.calls[0].duration : "00:00",
    status: lead.calls && lead.calls.length > 0 ? 
      (lead.calls[0].status === "success" ? "success" : "failed") : 
      "failed",
    analysis: hasAnalysis && lead.calls[0].status === "success" ? {
      summary: `Análise da chamada com ${lead.firstName} ${lead.lastName || ''}`,
      transcription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.",
      sentiment: {
        temperature: (lead.temperature || "warm") as "cold" | "warm" | "hot",
        reason: lead.temperature === "hot" ? 
          "Lead demonstrou grande interesse no produto" : 
          (lead.temperature === "warm" ? 
            "Lead demonstrou interesse moderado" : 
            "Lead com pouco interesse no momento")
      },
      leadInfo: {
        personType: lead.personType || "pf",
        firstName: lead.firstName,
        lastName: lead.lastName || "",
        razaoSocial: lead.razaoSocial || "",
        phone: lead.contactValue || "",
        email: lead.email || "",
      }
    } : undefined,
    crmInfo: lead.crmInfo,
    audioUrl: hasAnalysis ? 
      `https://example.com/audio/${lead.calls[0].fileName || "audio.mp3"}` : 
      undefined,
    phone: lead.contactValue || "",
    seller: "Maria Santos",
    mediaType: isVideoFile ? "video" : "audio",
  };
};

// Helper function to format the date to match the UI in the image
const formatDateToUI = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to update mock data dates to match the UI
const updateMockDatesToMatchUI = (leads: any[]) => {
  // Sort leads by createdAt date, newest first
  leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Update the dates to match what's shown in the UI
  const today = new Date();
  
  // RM Consultorias
  if (leads[0]) {
    leads[0].createdAt = new Date(today.getFullYear(), today.getMonth(), 21).toISOString(); // 21/03/2025
  }
  
  // Empresa Tecnologia
  if (leads[1]) {
    leads[1].createdAt = new Date(today.getFullYear(), today.getMonth(), 18).toISOString(); // 18/03/2025
  }
  
  // TechInova
  if (leads[2]) {
    leads[2].createdAt = new Date(today.getFullYear(), today.getMonth(), 15).toISOString(); // 15/03/2025
  }
  
  // Ana Silva
  if (leads[3]) {
    leads[3].createdAt = new Date(today.getFullYear(), today.getMonth(), 13).toISOString(); // 13/03/2025
  }
  
  // InnovaTech
  if (leads[4]) {
    leads[4].createdAt = new Date(today.getFullYear(), today.getMonth(), 8).toISOString(); // 08/03/2025
  }
  
  // Pedro Almeida
  if (leads[5]) {
    leads[5].createdAt = new Date(today.getFullYear(), today.getMonth(), 3).toISOString(); // 03/03/2025
  }
  
  // Tech Systems (Fernando Costa)
  if (leads[6]) {
    leads[6].createdAt = new Date(today.getFullYear(), today.getMonth() - 1, 26).toISOString(); // 26/02/2025
    leads[6].firstName = "Tech Systems";
    leads[6].lastName = "";
    leads[6].personType = "pj";
    leads[6].razaoSocial = "Tech Systems Soluções em TI Ltda";
  }
  
  return leads;
};

const OrganizationLeads = () => {
  const location = useLocation();
  const showCreateLeadFromState = location.state?.showCreateLead || false;
  const searchQueryFromState = location.state?.searchQuery || "";

  const [isFindLeadOpen, setIsFindLeadOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(showCreateLeadFromState);
  const [searchQuery, setSearchQuery] = useState(searchQueryFromState);
  const [currentCalls, setCurrentCalls] = useState<Call[]>([]);

  // Carregar os leads mockados quando o componente montar
  useEffect(() => {
    // Atualizar os dados mockados para corresponder à UI
    const updatedLeads = updateMockDatesToMatchUI([...leadsOrganizacao1]);
    
    // Converter leads para o formato de calls
    const calls = updatedLeads.map(leadToCall);
    setCurrentCalls(calls);
    toast.success(`${calls.length} leads da Organização 1 Ltda. carregados com sucesso!`);
  }, []);

  const handlePlayAudio = (audioUrl: string) => {
    console.log("Playing audio:", audioUrl);
    toast.info("Reproduzindo áudio...");
  };

  const handleViewAnalysis = (call: Call) => {
    console.log("Viewing analysis for call:", call);
  };

  const formatDate = (date: string) => {
    return formatDateToUI(date);
  };

  const {
    selectedCall,
    isAnalysisOpen,
    handleCloseAnalysis,
    createNewLead,
    confirmNewLead,
  } = useCallsPage();

  const {
    isUploadOpen,
    setIsUploadOpen,
    selectedLeadForUpload,
    setSelectedLeadForUpload,
    newLeadId,
    handleUploadClick,
    handleUploadSuccess,
    handleUploadCancel,
    handleLeadFound,
    handleCreateLead,
  } = useLeadUpload(createNewLead, (withUpload: boolean, newCall?: Call) => {
    if (newCall) {
      setCurrentCalls(prev => [newCall, ...prev]);
      confirmNewLead(withUpload, newCall);
    }
  });

  const monthStats: MonthStats = {
    total: currentCalls.length,
    active: currentCalls.filter(call => call.status === "success").length,
    processed: currentCalls.filter(call => call.status === "success").length,
    failed: currentCalls.filter(call => call.status === "failed").length,
    pending: 0 // There's no "pending" type in Call status, so we set it to 0
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <LeadsPageHeader
          onUploadClick={() => setIsFindLeadOpen(true)}
          onNewLeadClick={() => setIsCreateLeadOpen(true)}
          currentUser={mockLoggedUser}
          organization={mockOrganization}
        />

        <LeadsPageContent
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          monthStats={monthStats}
          calls={currentCalls}
          statusMap={statusMap}
          onPlayAudio={handlePlayAudio}
          onViewAnalysis={handleViewAnalysis}
          formatDate={formatDate}
        />

        <CallAnalysisDialog
          isOpen={isAnalysisOpen}
          onClose={handleCloseAnalysis}
          analysis={selectedCall?.analysis}
          call={{
            date: selectedCall?.date || "",
            duration: selectedCall?.duration || "",
          }}
        />

        <FindLeadDialog
          isOpen={isFindLeadOpen}
          onOpenChange={setIsFindLeadOpen}
          onLeadFound={handleLeadFound}
        />

        {(selectedLeadForUpload || newLeadId) && (
          <UploadCallDialog
            leadId={selectedLeadForUpload?.id || newLeadId || ""}
            isOpen={isUploadOpen}
            onOpenChange={(open) => {
              setIsUploadOpen(open);
              if (!open && newLeadId) {
                handleUploadCancel();
              }
            }}
            onUploadSuccess={() => {
              if (selectedLeadForUpload) {
                setSelectedLeadForUpload(null);
              } else {
                handleUploadSuccess();
              }
              setIsUploadOpen(false);
            }}
            onCancel={handleUploadCancel}
            leadInfo={selectedLeadForUpload ? {
              personType: selectedLeadForUpload.personType || "pf",
              firstName: selectedLeadForUpload.firstName,
              lastName: selectedLeadForUpload.lastName || "",
              razaoSocial: selectedLeadForUpload.razaoSocial || "",
              phone: selectedLeadForUpload.contactValue || selectedLeadForUpload.phone || ""
            } : undefined}
          />
        )}

        <CreateLeadDialog
          hasPhoneIntegration={true}
          hasEmailIntegration={true}
          onCreateLead={handleCreateLead}
          onUploadClick={handleUploadClick}
          isOpen={isCreateLeadOpen}
          onOpenChange={setIsCreateLeadOpen}
        />
      </div>
      <Toaster />
    </TooltipProvider>
  );
};

export default OrganizationLeads;
