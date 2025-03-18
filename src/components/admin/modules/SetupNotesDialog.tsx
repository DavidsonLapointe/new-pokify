
import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { SetupNote } from "@/components/organization/modules/types";

interface SetupNotesDialogProps {
  setupId: string;
  notes: SetupNote[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (setupId: string, note: string) => void;
}

export const SetupNotesDialog = ({
  setupId,
  notes,
  open,
  onOpenChange,
  onAddNote,
}: SetupNotesDialogProps) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Por favor, digite uma anotação");
      return;
    }

    onAddNote(setupId, newNote);
    setNewNote("");
    toast.success("Anotação adicionada com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Anotações da Implantação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="new-note"
              className="text-sm font-medium text-gray-700"
            >
              Nova Anotação
            </label>
            <Textarea
              id="new-note"
              placeholder="Digite sua anotação sobre esta implantação..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="h-24"
            />
            <Button onClick={handleAddNote} className="w-full mt-2">
              Adicionar Anotação
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Histórico de Anotações
            </h3>
            {notes.length > 0 ? (
              <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-4">
                  {notes.map((note, index) => (
                    <div key={index} className="space-y-1 pb-3 border-b last:border-b-0">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-gray-500">
                        {format(note.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                Nenhuma anotação encontrada para esta implantação.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
