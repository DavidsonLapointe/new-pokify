
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="default"
            onClick={handleSaveFunnel}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Funil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
