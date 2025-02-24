
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prompt } from "@/types/prompt";
import { EmptyPromptState } from "@/components/admin/prompts/EmptyPromptState";
import { PromptCard } from "@/components/admin/prompts/PromptCard";
import { ViewPromptDialog } from "@/components/admin/prompts/ViewPromptDialog";
import { PromptFormDialog } from "@/components/admin/prompts/PromptFormDialog";
import { supabase } from "@/integrations/supabase/client";

const AdminPrompt = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ name: "", content: "", description: "" });
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPrompts(data.map(prompt => ({
        id: prompt.id,
        name: prompt.name,
        content: prompt.content,
        description: prompt.description || ''
      })));
    } catch (error) {
      console.error('Erro ao buscar prompts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prompts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPrompt = () => {
    setNewPrompt({ name: "", content: "", description: "" });
    setIsEditing(false);
    setSelectedPrompt(null);
    setIsModalOpen(true);
  };

  const handleSavePrompt = async () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim() || !newPrompt.description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && selectedPrompt) {
        const { error } = await supabase
          .from('prompts')
          .update({
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description
          })
          .eq('id', selectedPrompt.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Prompt atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('prompts')
          .insert([{
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description
          }]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Prompt cadastrado com sucesso!",
        });
      }

      handleCancel();
      fetchPrompts();
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o prompt.",
        variant: "destructive",
      });
    }
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

      {!isLoading && prompts.length === 0 && <EmptyPromptState />}

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
