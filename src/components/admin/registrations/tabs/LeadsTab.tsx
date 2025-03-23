
import { NotesDialog } from "@/components/admin/leads/NotesDialog";
import { LeadsContent } from "@/components/admin/leads/LeadsContent";
import { mockLeadlyLeads } from "@/mocks/adminLeadsMocks";
import { useLeadsManagement } from "@/hooks/admin/useLeadsManagement";
import { LeadlyLead } from "@/pages/AdminLeads";

export const LeadsTab = () => {
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
