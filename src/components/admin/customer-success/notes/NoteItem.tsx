
import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ModuleNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

interface NoteItemProps {
  note: ModuleNote;
  noteId: string;
  moduleId: string;
  onEditNote?: (moduleId: string, noteId: string, newContent: string) => void;
  onConfirmDelete: (noteId: string) => void;
}

export const NoteItem = ({
  note,
  noteId,
  moduleId,
  onEditNote,
  onConfirmDelete,
}: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const startEditingNote = () => {
    setIsEditing(true);
    setEditContent(note.content);
  };

  const cancelEditingNote = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const saveEditedNote = () => {
    if (!editContent.trim()) {
      toast.error("A anotação não pode estar vazia");
      return;
    }

    if (onEditNote) {
      onEditNote(moduleId, noteId, editContent);
      setIsEditing(false);
      setEditContent("");
      toast.success("Anotação atualizada com sucesso!");
    }
  };

  return (
    <div className="space-y-2 pb-3 border-b last:border-b-0">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="h-20 text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={cancelEditingNote}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={saveEditedNote}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <p className="text-sm whitespace-pre-wrap flex-1">
            <span className="font-medium">({note.userName || "Usuário"})</span> {note.content}
          </p>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={startEditingNote}
            >
              <Pencil className="h-3.5 w-3.5 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onConfirmDelete(noteId)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        {format(note.createdAt, "dd/MM/yyyy 'às' HH:mm")}
      </p>
    </div>
  );
};
