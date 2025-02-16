
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { CallAnalysisDialog } from "@/components/calls/CallAnalysisDialog";
import { CallsHeader } from "@/components/calls/CallsHeader";
import { CreateLeadDialog } from "@/components/calls/CreateLeadDialog";
import { UploadCallDialog } from "@/components/calls/UploadCallDialog";
import { FindLeadDialog } from "@/components/calls/FindLeadDialog";
import { statusMap } from "@/constants/callStatus";
import { useCallsPage } from "@/hooks/useCallsPage";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/leads";
import { useToast } from "@/components/ui/use-toast";

const OrganizationLeads = () => {
  const { toast } = useToast();
  const location = useLocation();
  const showCreateLeadFromState = location.state?.showCreateLead;
  const searchQueryFromState = location.state?.searchQuery;

  const [isFindLeadOpen, setIsFindLeadOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedLeadForUpload, setSelectedLeadForUpload] = useState<Lead | null>(null);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(showCreateLeadFromState || false);

  const {
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredCalls,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
    addNewLead,
  } = useCallsPage();

  const handleCreateLead = (data: LeadFormData) => {
    addNewLead(data);
    setIsCreateLeadOpen(false);
    
    toast({
      title: "Lead criado com sucesso",
      description: "O novo lead foi adicionado à lista.",
    });

    if (showCreateLeadFromState) {
      setIsUploadOpen(true);
    }
  };

  const handleLeadFound = (lead: Lead) => {
    setSelectedLeadForUpload(lead);
    setIsUploadOpen(true);
  };

  // Efeito para preencher a busca quando vier do redirecionamento
  if (searchQueryFromState && searchQuery !== searchQueryFromState) {
    setSearchQuery(searchQueryFromState);
  }

  return (
    <OrganizationLayout>
      <TooltipProvider>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <CallsHeader 
              title="Análise de Leads"
              description="Visualize e gerencie todos os leads e suas chamadas"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFindLeadOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>

              <Button
                onClick={() => setIsCreateLeadOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Lead
              </Button>
            </div>
          </div>

          <CallsStats {...monthStats} />

          <Card className="p-6">
            <CallsFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <CallsTable
              calls={filteredCalls}
              statusMap={statusMap}
              onPlayAudio={handlePlayAudio}
              onViewAnalysis={handleViewAnalysis}
              formatDate={formatDate}
            />
          </Card>

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

          {selectedLeadForUpload && (
            <UploadCallDialog
              leadId={selectedLeadForUpload.id}
              isOpen={isUploadOpen}
              onOpenChange={setIsUploadOpen}
              onUploadSuccess={() => {
                setSelectedLeadForUpload(null);
              }}
            />
          )}

          <CreateLeadDialog
            hasPhoneIntegration={true}
            hasEmailIntegration={true}
            onCreateLead={handleCreateLead}
            isOpen={isCreateLeadOpen}
            onOpenChange={setIsCreateLeadOpen}
          />
        </div>
      </TooltipProvider>
    </OrganizationLayout>
  );
};

export default OrganizationLeads;
