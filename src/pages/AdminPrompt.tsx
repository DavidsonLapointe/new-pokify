import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prompt } from "@/types/prompt";
import { EmptyPromptState } from "@/components/admin/prompts/EmptyPromptState";
import { PromptCard } from "@/components/admin/prompts/PromptCard";
import { ViewPromptDialog } from "@/components/admin/prompts/ViewPromptDialog";
import { PromptFormDialog } from "@/components/admin/prompts/PromptFormDialog";

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
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onEdit={handleEdit}
            onView={handleView}
          />
        ))}
      </div>

      {prompts.length === 0 && <EmptyPromptState />}

      <ViewPromptDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        prompt={selectedPrompt}
      />

      <PromptFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        prompt={newPrompt}
        onPromptChange={setNewPrompt}
        onSave={handleSavePrompt}
        onCancel={handleCancel}
        isEditing={isEditing}
      />
    </div>
  );
};

export default AdminPrompt;
