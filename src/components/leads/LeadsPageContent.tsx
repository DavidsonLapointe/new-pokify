
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { StatusMap, Call } from "@/types/calls";
import { MonthStats } from "@/types/calls";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calcula o número total de páginas
  const totalPages = Math.ceil(calls.length / itemsPerPage);
  
  // Calcula os índices dos itens a serem exibidos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Obtém apenas os calls da página atual
  const currentCalls = calls.slice(startIndex, endIndex);

  // Gera array com números das páginas para navegação
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  console.log("LeadsPageContent - calls recebidos:", calls);
  console.log("LeadsPageContent - exibindo página:", currentPage);
  console.log("LeadsPageContent - itens por página:", itemsPerPage);
  
  return (
    <Card className="p-6 space-y-6">
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};
