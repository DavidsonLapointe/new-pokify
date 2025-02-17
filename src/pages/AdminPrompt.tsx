import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, FileText, Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Prompt {
  id: string;
  name: string;
  content: string;
  description: string;
}

const AdminPrompt = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ name: "", content: "", description: "" });
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleNewPrompt = () => {
    setNewPrompt({ name: "", content: "", description: "" });
    setIsEditing(false);
    setSelectedPrompt(null);
    setIsModalOpen(true);
  };

  const handleSavePrompt = () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim() || !newPrompt.description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && selectedPrompt) {
      const updatedPrompts = prompts.map((prompt) =>
        prompt.id === selectedPrompt.id ? { ...newPrompt, id: prompt.id } : prompt
      );
      setPrompts(updatedPrompts);
      toast({
        title: "Sucesso",
        description: "Prompt atualizado com sucesso!",
      });
    } else {
      const prompt: Prompt = {
        id: Date.now().toString(),
        name: newPrompt.name,
        content: newPrompt.content,
        description: newPrompt.description,
      };
      setPrompts([...prompts, prompt]);
      toast({
        title: "Sucesso",
        description: "Prompt cadastrado com sucesso!",
      });
    }

    handleCancel();
  };

  const handleCancel = () => {
    setNewPrompt({ name: "", content: "", description: "" });
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedPrompt(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setNewPrompt({
      name: prompt.name,
      content: prompt.content,
      description: prompt.description,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsViewModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Prompts</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus prompts de IA
            </p>
          </div>
          <Button onClick={handleNewPrompt}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Prompt
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate pr-4">{prompt.name}</h3>
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleView(prompt)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleEdit(prompt)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {prompt.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {prompts.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhum prompt cadastrado ainda.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique no botão "Novo Prompt" para começar.
              </p>
            </div>
          </Card>
        )}

        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Visualizar Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Nome</h4>
                <p className="text-sm text-muted-foreground">{selectedPrompt?.name}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Descrição</h4>
                <p className="text-sm text-muted-foreground">{selectedPrompt?.description}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Conteúdo</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedPrompt?.content}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Prompt" : "Novo Prompt"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome do Prompt
                </label>
                <Input
                  id="name"
                  value={newPrompt.name}
                  onChange={(e) =>
                    setNewPrompt({ ...newPrompt, name: e.target.value })
                  }
                  placeholder="Ex: Análise de Sentimento"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição da Finalidade
                </label>
                <Textarea
                  id="description"
                  value={newPrompt.description}
                  onChange={(e) =>
                    setNewPrompt({ ...newPrompt, description: e.target.value })
                  }
                  placeholder="Descreva brevemente a finalidade do prompt..."
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Conteúdo do Prompt
                </label>
                <Textarea
                  id="content"
                  value={newPrompt.content}
                  onChange={(e) =>
                    setNewPrompt({ ...newPrompt, content: e.target.value })
                  }
                  placeholder="Digite o conteúdo do prompt..."
                  className="min-h-[150px] resize-none"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSavePrompt}>
                {isEditing ? "Salvar Alterações" : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPrompt;
