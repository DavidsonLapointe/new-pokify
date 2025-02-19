
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronFirst, ChevronLast } from "lucide-react";

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

  // Gera array de páginas para exibição
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return pages;
  };
  
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
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(Number(page))}
                className={`w-8 h-8 p-0 ${currentPage === page ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};
