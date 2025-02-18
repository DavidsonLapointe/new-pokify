
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { Funnel } from "./types";

interface NewStageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newStage: string;
  setNewStage: (value: string) => void;
  newStageFunnelId: string;
  setNewStageFunnelId: (value: string) => void;
  handleSaveStage: () => void;
  funnels: Funnel[];
}

export const NewStageDialog = ({
  isOpen,
  onOpenChange,
  newStage,
  setNewStage,
  newStageFunnelId,
  setNewStageFunnelId,
  handleSaveStage,
  funnels,
}: NewStageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Etapa</DialogTitle>
          <DialogDescription>
            Defina o nome da etapa e vincule ao funil desejado para organizar o fluxo do seu processo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Etapa</label>
            <Input
              placeholder="Ex: Qualificação"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecione o Funil</label>
            <Select value={newStageFunnelId} onValueChange={setNewStageFunnelId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funil" />
              </SelectTrigger>
              <SelectContent>
                {funnels.map((funnel) => (
                  <SelectItem key={funnel.id} value={funnel.id}>
                    {funnel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="default"
            onClick={handleSaveStage}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Etapa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
