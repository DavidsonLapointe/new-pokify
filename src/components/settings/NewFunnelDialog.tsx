
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface NewFunnelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newFunnel: string;
  setNewFunnel: (value: string) => void;
  handleSaveFunnel: () => void;
}

export const NewFunnelDialog = ({
  isOpen,
  onOpenChange,
  newFunnel,
  setNewFunnel,
  handleSaveFunnel,
}: NewFunnelDialogProps) => {
  const handleSubmit = () => {
    handleSaveFunnel();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>Novo Funil</DialogTitle>
            <DialogDescription>
              Cadastre um novo funil para organizar suas oportunidades
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Funil</label>
              <Input
                placeholder="Ex: Funil de Vendas"
                value={newFunnel}
                onChange={(e) => setNewFunnel(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Funil
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
