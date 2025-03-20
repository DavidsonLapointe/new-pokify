
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LeadNote } from "@/pages/AdminLeads";
import { NotesList } from "./NotesList";
import { DeleteNoteDialog } from "@/components/admin/modules/dialogs/notes/DeleteNoteDialog";

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  leadId: string;
  notes: LeadNote[];
  onAddNote: (leadId: string, content: string) => void;
  onEditNote: (leadId: string, noteId: string, newContent: string) => void;
  onDeleteNote: (leadId: string, noteId: string) => void;
}

export const NotesDialog = ({
  isOpen,
  onClose,
  leadName,
  leadId,
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote
}: NotesDialogProps) => {
  const [newNote, setNewNote] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Por favor, digite uma anotação");
      return;
    }

    onAddNote(leadId, newNote);
    setNewNote("");
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      onDeleteNote(leadId, noteToDelete);
      setNoteToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anotações do Lead</DialogTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <p><strong>Cliente:</strong> {leadName}</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Nova Anotação
              </h3>
              <Textarea
                placeholder="Digite sua anotação sobre este lead..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="h-24 text-sm"
              />
              <Button 
                onClick={handleAddNote} 
                className="w-full mt-2"
              >
                Adicionar Anotação
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Histórico de Anotações
              </h3>
              <NotesList
                notes={notes}
                leadId={leadId}
                onEditNote={onEditNote}
                onConfirmDelete={(noteId) => {
                  setNoteToDelete(noteId);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
