
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronFirst, ChevronLast, ChevronUp, ChevronDown } from "lucide-react";

interface LeadsPageContentProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  monthStats: MonthStats;
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
  sortOrder: 'asc' | 'desc' | null;
  onSort: () => void;
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
  sortOrder,
  onSort,
}: LeadsPageContentProps) => {
  console.log("LeadsPageContent - calls recebidos:", calls);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCalls, setFilteredCalls] = useState(calls);
  const itemsPerPage = 10;

  // Reseta a página para 1 sempre que a busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // Filtra e ordena os calls baseado na busca e ordem
  useEffect(() => {
    let filtered = calls.filter((call) => {
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

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const nameA = `${a.leadInfo.firstName || ''} ${a.leadInfo.lastName || ''}`.trim().toLowerCase();
        const nameB = `${b.leadInfo.firstName || ''} ${b.leadInfo.lastName || ''}`.trim().toLowerCase();
        
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }
    
    setFilteredCalls(filtered);
  }, [calls, searchQuery, sortOrder]);
  
  // Calcula o índice inicial e final dos itens na página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Filtra os calls para a página atual
  const currentCalls = filteredCalls.slice(startIndex, endIndex);
  
  // Calcula o número total de páginas
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);

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
        sortOrder={sortOrder}
        onSort={onSort}
      />
      
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="default"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0 bg-primary text-white hover:bg-primary/90"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={page}
                variant={currentPage === Number(page) ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(Number(page))}
                className={`w-8 h-8 p-0 ${
                  currentPage === Number(page)
                    ? "bg-[#7E69AB] text-white hover:bg-[#7E69AB]/90"
                    : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#F1F0FB] hover:text-[#9b87f5]"
                }`}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="default"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0 bg-primary text-white hover:bg-primary/90"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};
