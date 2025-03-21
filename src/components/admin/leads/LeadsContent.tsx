
import { Card, CardContent } from "@/components/ui/card";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { LeadsFilter } from "@/components/admin/leads/LeadsFilter";
import { LeadsStats } from "@/components/admin/leads/LeadsStats";
import { LeadsPagination } from "@/components/admin/leads/LeadsPagination";
import { LeadlyLead } from "@/pages/AdminLeads";
import { useMemo } from "react";

interface LeadsContentProps {
  filteredLeads: LeadlyLead[];
  leadCounts: {
    contactar: number;
    qualificacao: number;
    nutricao_mkt: number;
    email_onboarding: number;
    ganho: number;
    perda: number;
    total: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onOpenNotes: (lead: LeadlyLead) => void;
  onUpdateLead: (updatedLead: LeadlyLead) => void;
}

const ITEMS_PER_PAGE = 10;

export const LeadsContent = ({
  filteredLeads,
  leadCounts,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  currentPage,
  setCurrentPage,
  onOpenNotes,
  onUpdateLead,
}: LeadsContentProps) => {
  
  // Calculate pagination
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Leads da Landing Page</h1>
        <p className="text-gray-500">
          Gerencie e acompanhe todos os leads capturados através da landing page do seu produto
        </p>
      </div>

      {/* Lead Stats Cards */}
      <LeadsStats counts={leadCounts} />

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <LeadsFilter 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            onClearFilters={onClearFilters}
          />
          <LeadsTable 
            leads={paginatedLeads} 
            onOpenNotes={onOpenNotes}
            onUpdateLead={onUpdateLead}
          />
          
          <LeadsPagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredLeads.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>
    </div>
  );
};
