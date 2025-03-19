
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotesDialog } from "./notes/NotesDialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

interface CustomerNotesProps {
  organizationId: string;
  organizationName: string;
}

export const CustomerNotes = ({ organizationId, organizationName }: CustomerNotesProps) => {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenNotes = () => {
    setIsNotesDialogOpen(true);
  };

  const handleAddNote = (moduleId: string, content: string) => {
    const newNote: CustomerNote = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      userName: "Usuário atual" // Ideally, get this from the auth context
    };
    
    setNotes(prev => [...prev, newNote]);
    toast.success("Anotação adicionada com sucesso!");
  };

  const handleEditNote = (moduleId: string, noteId: string, newContent: string) => {
    setNotes(prev => 
      prev.map(note => note.id === noteId ? { ...note, content: newContent } : note)
    );
  };

  const handleDeleteNote = (moduleId: string, noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success("Anotação excluída com sucesso!");
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="p-5 flex flex-row items-center justify-between">
          <CardTitle>Anotações sobre o Cliente</CardTitle>
          <Button onClick={handleOpenNotes}>
            Gerenciar Anotações
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : notes.length > 0 ? (
            <div className="space-y-4">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="p-3 border rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {note.userName} - {note.createdAt.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
              {notes.length > 3 && (
                <Button variant="link" onClick={handleOpenNotes} className="px-0">
                  Ver todas as {notes.length} anotações
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Nenhuma anotação registrada para este cliente.
              </p>
              <Button 
                variant="outline" 
                onClick={handleOpenNotes} 
                className="mt-2"
              >
                Adicionar anotação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <NotesDialog
        isOpen={isNotesDialogOpen}
        onClose={() => setIsNotesDialogOpen(false)}
        moduleName={organizationName}
        moduleId={organizationId}
        notes={notes}
        onAddNote={handleAddNote}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
      />
    </>
  );
};
