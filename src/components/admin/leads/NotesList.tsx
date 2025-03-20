
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadNote } from "@/pages/AdminLeads";
import { NoteItem } from "./NoteItem";

interface NotesListProps {
  notes: LeadNote[];
  leadId: string;
  onEditNote: (leadId: string, noteId: string, newContent: string) => void;
  onConfirmDelete: (noteId: string) => void;
}

export const NotesList = ({
  notes,
  leadId,
  onEditNote,
  onConfirmDelete
}: NotesListProps) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        Nenhuma anotação encontrada para este lead.
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
            leadId={leadId}
            onEditNote={onEditNote}
            onConfirmDelete={onConfirmDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
