
import { TooltipProvider } from "@/components/ui/tooltip";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { CallAnalysisDialog } from "@/components/calls/CallAnalysisDialog";
import { CallsHeader } from "@/components/calls/CallsHeader";
import { statusMap } from "@/constants/callStatus";
import { useCallsPage } from "@/hooks/useCallsPage";

const OrganizationCalls = () => {
  const {
    selectedMonthYear,
    selectedStatus,
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredCalls,
    getMonthYearOptions,
    handleMonthYearChange,
    setSelectedStatus,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
  } = useCallsPage();

  return (
    <OrganizationLayout>
      <TooltipProvider>
        <div className="space-y-8">
          <CallsHeader 
            title="Chamadas"
            description="Visualize e gerencie todas as chamadas recebidas"
          />

          <CallsStats {...monthStats} />

          <Card className="p-6">
            <CallsFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedMonthYear={selectedMonthYear}
              onMonthYearChange={handleMonthYearChange}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              monthYearOptions={getMonthYearOptions()}
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

export default OrganizationCalls;
