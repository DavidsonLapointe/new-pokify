
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, FileText } from "lucide-react";
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
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ name: "", content: "", description: "" });
  const { toast } = useToast();

  const handleSavePrompt = () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim() || !newPrompt.description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const prompt: Prompt = {
      id: Date.now().toString(),
      name: newPrompt.name,
      content: newPrompt.content,
      description: newPrompt.description,
    };

    setPrompts([...prompts, prompt]);
    setNewPrompt({ name: "", content: "", description: "" });
    setIsModalOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Prompt cadastrado com sucesso!",
    });
  };

  const handleCancel = () => {
    setNewPrompt({ name: "", content: "", description: "" });
    setIsModalOpen(false);
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
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Prompt
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold">{prompt.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {prompt.description}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {prompt.content}
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Novo Prompt</DialogTitle>
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
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPrompt;
