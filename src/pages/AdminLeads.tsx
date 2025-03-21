
import { NotesDialog } from "@/components/admin/leads/NotesDialog";
import { LeadsContent } from "@/components/admin/leads/LeadsContent";
import { mockLeadlyLeads } from "@/mocks/adminLeadsMocks";
import { useLeadsManagement } from "@/hooks/admin/useLeadsManagement";

export type LeadNote = {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
};

export interface LeadlyLead {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  status: string;
  notes: LeadNote[];
  personType?: "pf" | "pj";
  email?: string;
  companyName?: string;
  employeeCount?: string;
  sector?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  lossReason?: string;
}

const AdminLeads = () => {
  const {
    selectedLead,
    isNotesDialogOpen,
    searchQuery,
    statusFilter,
    currentPage,
    setCurrentPage,
    leadCounts,
    filteredLeads,
    handleOpenNotes,
    handleUpdateLead,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleClearFilters,
    setIsNotesDialogOpen,
    setSearchQuery,
    setStatusFilter
  } = useLeadsManagement(mockLeadlyLeads);

  return (
    <>
      <LeadsContent 
        filteredLeads={filteredLeads}
        leadCounts={leadCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenNotes={handleOpenNotes}
        onUpdateLead={handleUpdateLead}
      />

      {selectedLead && (
        <NotesDialog
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          leadName={selectedLead.name}
          leadId={selectedLead.id}
          notes={selectedLead.notes}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </>
  );
};

export default AdminLeads;
