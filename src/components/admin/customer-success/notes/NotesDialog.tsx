
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DeleteNoteDialog } from "@/components/admin/modules/dialogs/notes/DeleteNoteDialog";
import { NotesList } from "./NotesList";
import { X } from "lucide-react";

interface ModuleNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  moduleId: string;
  notes: ModuleNote[];
  onAddNote: (moduleId: string, content: string) => void;
  onEditNote: (moduleId: string, noteId: string, newContent: string) => void;
  onDeleteNote: (moduleId: string, noteId: string) => void;
}

export const NotesDialog = ({
  isOpen,
  onClose,
  moduleName,
  moduleId,
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote
}: NotesDialogProps) => {
  const [newNote, setNewNote] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      onDeleteNote(moduleId, noteToDelete);
      setNoteToDelete(null);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Por favor, digite uma anotação");
      return;
    }

    onAddNote(moduleId, newNote);
    setNewNote("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Anotações de Customer Success</DialogTitle>
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="px-6 pb-2">
            <div className="text-sm text-gray-600 -mt-2">
              <p>Empresa: {moduleName}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Nova Anotação</h3>
              <Textarea
                placeholder="Digite sua anotação sobre esta implantação..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="h-24 text-sm"
              />
              <Button 
                onClick={handleAddNote} 
                className="w-full mt-3 bg-purple-500 hover:bg-purple-600"
              >
                Adicionar Anotação
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Histórico de Anotações</h3>
              <NotesList
                notes={notes}
                moduleId={moduleId}
                onEditNote={(moduleId, noteId, content) => onEditNote(moduleId, noteId, content)}
                onConfirmDelete={(noteId) => setNoteToDelete(noteId)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <DeleteNoteDialog
        isOpen={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
