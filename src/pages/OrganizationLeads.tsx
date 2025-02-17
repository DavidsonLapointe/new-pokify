
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrganizationLayout from "@/components/OrganizationLayout";
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

// Mock do usuário logado - depois será substituído pela autenticação real
const mockLoggedUser = {
  id: 1,
  name: "João Silva",
  email: "joao@empresa.com",
  role: "admin",
  status: "active",
  permissions: {
    dashboard: ["view", "export"],
    calls: ["view", "upload", "delete"],
    leads: ["view", "edit", "delete"],
    integrations: ["view", "edit"],
  },
};

// Mock da organização - depois será substituído pelos dados reais
const mockOrganization = {
  id: 1,
  name: "Tech Solutions Ltda",
  integratedCRM: "HubSpot",
  integratedLLM: "GPT-4O",
  users: [
    {
      id: 1,
      name: "João Silva",
      email: "joao@empresa.com",
      role: "admin",
      status: "active",
      permissions: {
        integrations: ["view", "edit"],
      },
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "admin",
      status: "active",
      permissions: {
        integrations: ["view", "edit"],
      },
    },
  ],
};

const OrganizationLeads = () => {
  const location = useLocation();
  const showCreateLeadFromState = location.state?.showCreateLead || false;
  const searchQueryFromState = location.state?.searchQuery || "";

  const [isFindLeadOpen, setIsFindLeadOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(showCreateLeadFromState);

  const {
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredLeads,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
    createNewLead,
    confirmNewLead,
  } = useCallsPage();

  const {
    isUploadOpen,
    setIsUploadOpen,
    selectedLeadForUpload,
    setSelectedLeadForUpload,
    newLeadId,
    handleCreateLead,
    handleUploadClick,
    handleUploadSuccess,
    handleUploadCancel,
    handleLeadFound,
  } = useLeadUpload(createNewLead, confirmNewLead);

  // Configuração inicial do searchQuery
  useState(() => {
    if (searchQueryFromState && searchQuery !== searchQueryFromState) {
      setSearchQuery(searchQueryFromState);
    }
  });

  return (
    <OrganizationLayout>
      <TooltipProvider>
        <div className="space-y-8">
          <LeadsPageHeader
            onUploadClick={() => setIsFindLeadOpen(true)}
            onNewLeadClick={() => setIsCreateLeadOpen(true)}
            currentUser={mockLoggedUser}
            organization={mockOrganization}
          />

          <LeadsPageContent
            searchQuery={searchQuery || ""}
            onSearchChange={setSearchQuery}
            monthStats={monthStats}
            calls={filteredLeads}
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
      </TooltipProvider>
      <Toaster />
    </OrganizationLayout>
  );
};

export default OrganizationLeads;
