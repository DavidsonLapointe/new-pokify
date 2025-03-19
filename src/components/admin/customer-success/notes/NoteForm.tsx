
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NoteFormProps {
  moduleId: string;
  onAddNote: (moduleId: string, note: string) => void;
}

export const NoteForm = ({ moduleId, onAddNote }: NoteFormProps) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Por favor, digite uma anotação");
      return;
    }

    onAddNote(moduleId, newNote);
    setNewNote("");
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="new-note"
        className="text-sm font-medium text-gray-700"
      >
        Nova Anotação
      </label>
      <Textarea
        id="new-note"
        placeholder="Digite sua anotação sobre esta ferramenta..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className="h-24"
      />
      <Button onClick={handleAddNote} className="w-full mt-2">
        Adicionar Anotação
      </Button>
    </div>
  );
};
