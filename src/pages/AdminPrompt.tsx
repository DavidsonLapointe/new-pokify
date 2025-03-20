
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ViewPromptDialog } from "@/components/admin/prompts/ViewPromptDialog";
import { PromptFormDialog } from "@/components/admin/prompts/PromptFormDialog";
import { PromptGroups } from "@/components/admin/prompts/PromptGroups";
import { usePrompts } from "@/hooks/admin/prompts/usePrompts";
import { usePromptForm } from "@/hooks/admin/prompts/usePromptForm";
import { availableModules, groupPromptsByModule } from "@/utils/admin/prompts/promptUtils";

const AdminPrompt = () => {
  const [activeTab, setActiveTab] = useState("global");
  const { prompts, isLoading, fetchPrompts } = usePrompts();
  const {
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
  } = usePromptForm(fetchPrompts);

  // Group prompts by module and type
  const globalPromptGroups = groupPromptsByModule(prompts, 'global', availableModules);
  const customPromptGroups = groupPromptsByModule(prompts, 'custom', availableModules);

  // Convert availableModules to the expected format for the PromptFormDialog
  const moduleOptions = availableModules.map(module => ({
    id: module.id,
    name: module.name,
    icon: module.icon
  }));

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

      <Tabs defaultValue="global" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="global">Prompts Globais</TabsTrigger>
          <TabsTrigger value="custom">Prompts Customizados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-6">
          <PromptGroups 
            promptGroups={globalPromptGroups} 
            isLoading={isLoading} 
            onEdit={handleEdit} 
            onView={handleView} 
          />
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <PromptGroups 
            promptGroups={customPromptGroups} 
            isLoading={isLoading} 
            onEdit={handleEdit} 
            onView={handleView} 
          />
        </TabsContent>
      </Tabs>

      <ViewPromptDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        prompt={selectedPrompt}
      />

      <PromptFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        prompt={newPrompt}
        onPromptChange={handlePromptChange}
        onSave={handleSavePrompt}
        onCancel={handleCancel}
        isEditing={isEditing}
        modules={moduleOptions}
      />
    </div>
  );
};

export default AdminPrompt;
