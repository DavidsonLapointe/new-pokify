
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
import { useUser } from "@/contexts/UserContext";
import { Pencil, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const { user } = useUser();
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Por favor, digite uma anotação");
      return;
    }

    onAddNote(setupId, newNote);
    setNewNote("");
    toast.success("Anotação adicionada com sucesso!");
  };

  const startEditingNote = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditContent(content);
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  const saveEditedNote = (noteId: string) => {
    if (!editContent.trim()) {
      toast.error("A anotação não pode estar vazia");
      return;
    }

    if (onEditNote) {
      onEditNote(setupId, noteId, editContent);
      setEditingNoteId(null);
      setEditContent("");
      toast.success("Anotação atualizada com sucesso!");
    }
  };

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

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
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
                    {notes.map((note, index) => {
                      const noteId = note.id || `note-${index}`;
                      const isEditing = editingNoteId === noteId;

                      return (
                        <div key={noteId} className="space-y-2 pb-3 border-b last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={note.userAvatar} alt={note.userName || "Usuário"} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(note.userName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {note.userName || "Usuário"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => startEditingNote(noteId, note.content)}
                              >
                                <Pencil className="h-3.5 w-3.5 text-primary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => confirmDeleteNote(noteId)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>

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
                                  onClick={() => saveEditedNote(noteId)}
                                >
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">
                              <span className="font-medium">({note.userName || "Usuário"})</span> {note.content}
                            </p>
                          )}

                          <p className="text-xs text-gray-500">
                            {format(note.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        </div>
                      );
                    })}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anotação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
