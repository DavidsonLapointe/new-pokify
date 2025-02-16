
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { StatusMap } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import { LeadWithCalls } from "@/types/leads";

interface LeadsPageContentProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  monthStats: MonthStats;
  calls: LeadWithCalls[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: any) => void;
  formatDate: (date: string) => string;
}

export const LeadsPageContent = ({
  searchQuery,
  onSearchChange,
  monthStats,
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: LeadsPageContentProps) => {
  // Log para debug
  console.log("LeadsPageContent - calls recebidos:", calls);
  
  return (
    <>
      <CallsStats {...monthStats} />
      <Card className="p-6">
        <CallsFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <CallsTable
          calls={calls}
          statusMap={statusMap}
          onPlayAudio={onPlayAudio}
          onViewAnalysis={onViewAnalysis}
          formatDate={formatDate}
        />
      </Card>
    </>
  );
};
