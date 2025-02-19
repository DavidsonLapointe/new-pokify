
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import { useState } from "react";

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
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calcula o índice inicial e final dos itens na página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Filtra os calls para a página atual
  const currentCalls = calls.slice(startIndex, endIndex);
  
  // Calcula o número total de páginas
  const totalPages = Math.ceil(calls.length / itemsPerPage);
  
  return (
    <Card className="p-4 space-y-4">
      <CallsFilters
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <CallsTable
        calls={currentCalls}
        statusMap={statusMap}
        onPlayAudio={onPlayAudio}
        onViewAnalysis={onViewAnalysis}
        formatDate={formatDate}
      />
      
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
          >
            Anterior
          </button>
          
          <span className="px-3 py-1">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </Card>
  );
};
