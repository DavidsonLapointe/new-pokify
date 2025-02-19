
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            size="sm"
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              Página {currentPage} de {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            size="sm"
          >
            Próxima
          </Button>
        </div>
      )}
    </Card>
  );
};
