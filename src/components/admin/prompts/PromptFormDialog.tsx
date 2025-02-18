
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Prompt } from "@/types/prompt";

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Omit<Prompt, "id">;
  onPromptChange: (prompt: Omit<Prompt, "id">) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const PromptFormDialog = ({
  open,
  onOpenChange,
  prompt,
  onPromptChange,
  onSave,
  onCancel,
  isEditing,
}: PromptFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={prompt.name}
              onChange={(e) =>
                onPromptChange({ ...prompt, name: e.target.value })
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
              value={prompt.description}
              onChange={(e) =>
                onPromptChange({ ...prompt, description: e.target.value })
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
              value={prompt.content}
              onChange={(e) =>
                onPromptChange({ ...prompt, content: e.target.value })
              }
              placeholder="Digite o conteúdo do prompt..."
              className="min-h-[150px] resize-none"
            />
          </div>
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
