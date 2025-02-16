
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";

interface LeadsPageContentProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  monthStats: MonthStats;
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
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
