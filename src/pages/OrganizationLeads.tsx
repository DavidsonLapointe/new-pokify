
import { useState } from "react";
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

const mockOrganization: Organization = {
  id: "1",
  name: "Tech Solutions Ltda",
  nomeFantasia: "Tech Solutions",
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
  email: "contato@techsolutions.com",
  phone: "(11) 3333-3333",
  cnpj: "12.345.678/0001-90",
  adminName: "João Silva",
  adminEmail: "joao@empresa.com",
  contractSignedAt: null,
  createdAt: "2024-01-01T00:00:00.000Z",
};

const mockLoggedUser: User = {
  id: "2",
  name: "Maria Santos",
  email: "maria@empresa.com",
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

const OrganizationLeads = () => {
  const location = useLocation();
  const showCreateLeadFromState = location.state?.showCreateLead || false;
  const searchQueryFromState = location.state?.searchQuery || "";

  const [isFindLeadOpen, setIsFindLeadOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(showCreateLeadFromState);
  const [searchQuery, setSearchQuery] = useState(searchQueryFromState);
  const [currentCalls, setCurrentCalls] = useState<Call[]>([]);

  const handlePlayAudio = (audioUrl: string) => {
    console.log("Playing audio:", audioUrl);
  };

  const handleViewAnalysis = (call: any) => {
    console.log("Viewing analysis for call:", call);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
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

  const monthStats = {
    total: currentCalls.length,
    processed: currentCalls.filter(call => call.status === "success").length,
    failed: currentCalls.filter(call => call.status === "failed").length,
    pending: 0
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
