
import React from "react";
import { SetupStatus } from "@/components/organization/modules/types";
import { ModuleSetupsFilters } from "./ModuleSetupsFilters";
import { ModuleSetupsTable } from "./ModuleSetupsTable";
import { ModuleSetupNotes } from "./ModuleSetupNotes";
import { useModuleSetups } from "./hooks/useModuleSetups";

interface ModuleSetupsListProps {
  onStatusChange?: (setupId: string, moduleId: string, organizationId: string, newStatus: SetupStatus) => void;
}

export const ModuleSetupsList: React.FC<ModuleSetupsListProps> = ({ onStatusChange }) => {
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
    setShowNotesDialog
  } = useModuleSetups(onStatusChange);
  
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
