
import React from "react";
import { ModuleSetup, SetupNote } from "@/components/organization/modules/types";
import { SetupNotesDialog } from "./SetupNotesDialog";

interface ModuleSetupNotesProps {
  selectedSetup: ModuleSetup | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (setupId: string, note: string) => void;
  onEditNote: (setupId: string, noteId: string, newContent: string) => void;
  onDeleteNote: (setupId: string, noteId: string) => void;
}

export const ModuleSetupNotes: React.FC<ModuleSetupNotesProps> = ({
  selectedSetup,
  open,
  onOpenChange,
  onAddNote,
  onEditNote,
  onDeleteNote
}) => {
  if (!selectedSetup) return null;

  return (
    <SetupNotesDialog
      setupId={selectedSetup.id}
      organizationName={selectedSetup.organizationName || selectedSetup.organizationId}
      moduleName={selectedSetup.moduleName || selectedSetup.moduleId}
      notes={selectedSetup.notes || []}
      open={open}
      onOpenChange={onOpenChange}
      onAddNote={onAddNote}
      onEditNote={onEditNote}
      onDeleteNote={onDeleteNote}
    />
  );
};
