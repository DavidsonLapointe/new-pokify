
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/types/prompt";

interface ViewPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onEdit?: () => void;
}

export const ViewPromptDialog = ({
  open,
  onOpenChange,
  prompt,
  onEdit
}: ViewPromptDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Visualizar Prompt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Nome</h4>
            <p className="text-sm text-muted-foreground">{prompt?.name}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm text-muted-foreground">{prompt?.description}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Conteúdo</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {prompt?.content}
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {onEdit && (
            <Button variant="default" onClick={onEdit}>
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
