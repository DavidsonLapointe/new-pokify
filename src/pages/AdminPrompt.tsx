
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus } from "lucide-react";
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
}

const AdminPrompt = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ name: "", content: "" });
  const { toast } = useToast();

  const handleSavePrompt = () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) {
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
    };

    setPrompts([...prompts, prompt]);
    setNewPrompt({ name: "", content: "" });
    setIsModalOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Prompt cadastrado com sucesso!",
    });
  };

  const handleCancel = () => {
    setNewPrompt({ name: "", content: "" });
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
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {prompt.content}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {prompts.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <p>Nenhum prompt cadastrado ainda.</p>
              <p className="text-sm mt-1">
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
