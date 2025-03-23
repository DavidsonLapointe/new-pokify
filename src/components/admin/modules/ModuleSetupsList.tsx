
import React from "react";
import { SetupStatus } from "@/components/organization/modules/types";
import { ModuleSetupsFilters } from "./ModuleSetupsFilters";
import { ModuleSetupsTable } from "./ModuleSetupsTable";
import { ModuleSetupNotes } from "./ModuleSetupNotes";
import { useModuleSetups } from "./hooks/useModuleSetups";
import { LeadsPagination } from "@/components/admin/leads/LeadsPagination";

interface ModuleSetupsListProps {
  onStatusChange?: (setupId: string, moduleId: string, organizationId: string, newStatus: SetupStatus) => void;
  currentPage?: number;
  itemsPerPage?: number;
}

export const ModuleSetupsList: React.FC<ModuleSetupsListProps> = ({ 
  onStatusChange,
  currentPage = 1,
  itemsPerPage = 5
}) => {
  const {
    searchTerm,
    statusFilter,
    filteredSetups,
    showNotesDialog,
    selectedSetup,
    setSearchTerm,
    setStatusFilter,
    handleStatusChange,
    handleOpenNotes,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleClearFilters,
    handleStatusFilterChange,
    setShowNotesDialog,
    setCurrentPage,
    totalPages
  } = useModuleSetups(onStatusChange, currentPage, itemsPerPage);
  
  // Calculate if we should show pagination
  const shouldShowPagination = filteredSetups.length > 0 && totalPages > 1;
  
  return (
    <div className="space-y-4">
      <ModuleSetupsFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={handleStatusFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      <ModuleSetupsTable
        setups={filteredSetups}
        onStatusChange={handleStatusChange}
        onOpenNotes={handleOpenNotes}
      />
      
      {shouldShowPagination && (
        <LeadsPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalPages * itemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      )}
      
      <ModuleSetupNotes
        selectedSetup={selectedSetup}
        open={showNotesDialog}
        onOpenChange={setShowNotesDialog}
        onAddNote={handleAddNote}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
};
