
import { TooltipProvider } from "@/components/ui/tooltip";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { CallAnalysisDialog } from "@/components/calls/CallAnalysisDialog";
import { CallsHeader } from "@/components/calls/CallsHeader";
import { CreateLeadDialog } from "@/components/calls/CreateLeadDialog";
import { statusMap } from "@/constants/callStatus";
import { useCallsPage } from "@/hooks/useCallsPage";
import { LeadFormData } from "@/schemas/leadFormSchema";

const OrganizationLeads = () => {
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
  } = useCallsPage();

  const handleCreateLead = (data: LeadFormData) => {
    // Aqui seria implementada a lógica de criação do lead
    console.log("Novo lead:", data);
  };

  return (
    <OrganizationLayout>
      <TooltipProvider>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <CallsHeader 
              title="Análise de Leads"
              description="Visualize e gerencie todos os leads e suas chamadas"
            />

            <CreateLeadDialog
              hasPhoneIntegration={true}
              hasEmailIntegration={true}
              onCreateLead={handleCreateLead}
            />
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
          />
        </div>
      </TooltipProvider>
    </OrganizationLayout>
  );
};

export default OrganizationLeads;
