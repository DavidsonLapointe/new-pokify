
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetupNote } from "@/components/organization/modules/types";
import { toast } from "sonner";
import { NoteForm } from "./dialogs/notes/NoteForm";
import { NotesList } from "./dialogs/notes/NotesList";
import { DeleteNoteDialog } from "./dialogs/notes/DeleteNoteDialog";

interface SetupNotesDialogProps {
  setupId: string;
  organizationName: string;
  moduleName: string;
  notes: SetupNote[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (setupId: string, note: string) => void;
  onEditNote?: (setupId: string, noteId: string, newContent: string) => void;
  onDeleteNote?: (setupId: string, noteId: string) => void;
}

export const SetupNotesDialog = ({
  setupId,
  organizationName,
  moduleName,
  notes,
  open,
  onOpenChange,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: SetupNotesDialogProps) => {
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const confirmDeleteNote = (noteId: string) => {
    setDeleteNoteId(noteId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteNote = () => {
    if (deleteNoteId && onDeleteNote) {
      onDeleteNote(setupId, deleteNoteId);
      setDeleteNoteId(null);
      setIsDeleteDialogOpen(false);
      toast.success("Anotação excluída com sucesso!");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anotações da Implantação</DialogTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <p><strong>Empresa:</strong> {organizationName}</p>
              <p><strong>Módulo:</strong> {moduleName}</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <NoteForm 
              setupId={setupId}
              onAddNote={onAddNote}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Histórico de Anotações
              </h3>
              <NotesList
                notes={notes}
                setupId={setupId}
                onEditNote={onEditNote}
                onConfirmDelete={confirmDeleteNote}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteNote}
      />
    </>
  );
};
