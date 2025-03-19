
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteItem } from "./NoteItem";

interface ModuleNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

interface NotesListProps {
  notes: ModuleNote[];
  moduleId: string;
  onEditNote?: (moduleId: string, noteId: string, newContent: string) => void;
  onConfirmDelete: (noteId: string) => void;
}

export const NotesList = ({
  notes,
  moduleId,
  onEditNote,
  onConfirmDelete,
}: NotesListProps) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        Nenhuma anotação encontrada para esta ferramenta.
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 rounded-md border p-4">
      <div className="space-y-4">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            noteId={note.id}
            moduleId={moduleId}
            onEditNote={onEditNote}
            onConfirmDelete={onConfirmDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
