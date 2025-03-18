
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/types/prompt";
import { PromptTypeSelector } from "./form/PromptTypeSelector";
import { CompanySelector } from "./form/CompanySelector";
import { ModuleSelector } from "./form/ModuleSelector";
import { PromptFormFields } from "./form/PromptFormFields";
import { usePromptFormDialog } from "./form/usePromptFormDialog";

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Omit<Prompt, "id"> & { module: string; company_id?: string };
  onPromptChange: (prompt: Omit<Prompt, "id"> & { module: string; company_id?: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  modules?: { id: string; name: string; icon: string }[];
}

export const PromptFormDialog = ({
  open,
  onOpenChange,
  prompt,
  onPromptChange,
  onSave,
  onCancel,
  isEditing,
  modules,
}: PromptFormDialogProps) => {
  const {
    handleTypeChange,
    handleCompanyChange,
    handleModuleChange,
    handleNameChange,
    handleDescriptionChange,
    handleContentChange
  } = usePromptFormDialog({ prompt, onPromptChange, open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Prompt" : "Novo Prompt"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <PromptFormFields
            name={prompt.name}
            description={prompt.description}
            content={prompt.content}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onContentChange={handleContentChange}
          />
          
          <PromptTypeSelector 
            value={prompt.type}
            onChange={handleTypeChange}
          />
          
          <CompanySelector
            value={prompt.company_id}
            onChange={handleCompanyChange}
            isVisible={prompt.type === "custom"}
          />
          
          <ModuleSelector
            value={prompt.module}
            onChange={handleModuleChange}
            modules={modules}
          />
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="cancel" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Salvar Alterações" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
