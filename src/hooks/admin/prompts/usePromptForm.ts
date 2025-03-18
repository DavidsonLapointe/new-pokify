
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Prompt } from "@/types/prompt";
import { supabase } from "@/integrations/supabase/client";

// Type for form data
export type PromptFormData = Omit<Prompt, "id"> & { 
  company_id?: string;
};

export const usePromptForm = (fetchPrompts: () => Promise<void>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState<PromptFormData>({ 
    name: "", 
    content: "", 
    description: "",
    type: "global",
    module: "geral",
    company_id: undefined
  });
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleNewPrompt = () => {
    setNewPrompt({ 
      name: "", 
      content: "", 
      description: "", 
      type: "global", 
      module: "geral", 
      company_id: undefined 
    });
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

    if (newPrompt.type === "custom" && !newPrompt.company_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma empresa para o prompt customizado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const metadata: Record<string, any> = { 
        module: newPrompt.module 
      };
      
      // Adicionar company_id ao metadata apenas para prompts customizados
      if (newPrompt.type === "custom" && newPrompt.company_id) {
        metadata.company_id = newPrompt.company_id;
      }
      
      if (isEditing && selectedPrompt) {
        const { error } = await supabase
          .from('prompts')
          .update({
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description,
            type: newPrompt.type,
            metadata
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
          .insert({
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description,
            type: newPrompt.type,
            metadata
          });

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
    setNewPrompt({ 
      name: "", 
      content: "", 
      description: "", 
      type: "global", 
      module: "geral", 
      company_id: undefined 
    });
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
      type: prompt.type,
      module: prompt.module || 'geral',
      company_id: prompt.company_id
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsViewModalOpen(true);
  };

  const handlePromptChange = (updatedPrompt: PromptFormData) => {
    setNewPrompt(updatedPrompt);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    newPrompt,
    selectedPrompt,
    isEditing,
    handleNewPrompt,
    handleSavePrompt,
    handleCancel,
    handleEdit,
    handleView,
    handlePromptChange
  };
};
