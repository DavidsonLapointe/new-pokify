
import { CallsTable } from "@/components/calls/CallsTable";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import { useState, useEffect } from "react";

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
  
  const [filteredCalls, setFilteredCalls] = useState(calls);
  
  // Filtra os calls baseado na busca
  useEffect(() => {
    const filtered = calls.filter((call) => {
      const searchLower = searchQuery.toLowerCase();
      const leadInfo = call.leadInfo;
      
      return (
        leadInfo.firstName?.toLowerCase().includes(searchLower) ||
        leadInfo.lastName?.toLowerCase().includes(searchLower) ||
        leadInfo.email?.toLowerCase().includes(searchLower) ||
        leadInfo.phone?.toLowerCase().includes(searchLower) ||
        leadInfo.razaoSocial?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredCalls(filtered);
  }, [calls, searchQuery]);
  
  return (
    <div className="space-y-4">
      <CallsTable
        calls={filteredCalls}
        statusMap={statusMap}
        onPlayAudio={onPlayAudio}
        onViewAnalysis={onViewAnalysis}
        formatDate={formatDate}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
  );
};
