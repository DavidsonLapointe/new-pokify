
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesList } from "./NotesList";
import { NoteForm } from "./NoteForm";
import { DeleteNoteDialog } from "@/components/admin/modules/dialogs/notes/DeleteNoteDialog";

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
  const [activeTab, setActiveTab] = useState("notes");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      onDeleteNote(moduleId, noteToDelete);
      setNoteToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anotações - {moduleName}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="notes">Anotações</TabsTrigger>
              <TabsTrigger value="add">Adicionar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="mt-4">
              <NotesList
                notes={notes}
                moduleId={moduleId}
                onEditNote={(moduleId, noteId, content) => onEditNote(moduleId, noteId, content)}
                onConfirmDelete={(noteId) => setNoteToDelete(noteId)}
              />
            </TabsContent>
            
            <TabsContent value="add" className="mt-4">
              <NoteForm
                moduleId={moduleId}
                onAddNote={(moduleId, content) => {
                  onAddNote(moduleId, content);
                  setActiveTab("notes");
                }}
              />
            </TabsContent>
          </Tabs>
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
