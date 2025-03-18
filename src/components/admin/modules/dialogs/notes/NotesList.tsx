
import { ScrollArea } from "@/components/ui/scroll-area";
import { SetupNote } from "@/components/organization/modules/types";
import { NoteItem } from "./NoteItem";

interface NotesListProps {
  notes: SetupNote[];
  setupId: string;
  onEditNote?: (setupId: string, noteId: string, newContent: string) => void;
  onConfirmDelete: (noteId: string) => void;
}

export const NotesList = ({
  notes,
  setupId,
  onEditNote,
  onConfirmDelete,
}: NotesListProps) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        Nenhuma anotação encontrada para esta implantação.
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 rounded-md border p-4">
      <div className="space-y-4">
        {notes.map((note, index) => {
          const noteId = note.id || `note-${index}`;
          
          return (
            <NoteItem
              key={noteId}
              note={note}
              noteId={noteId}
              setupId={setupId}
              onEditNote={onEditNote}
              onConfirmDelete={onConfirmDelete}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};
