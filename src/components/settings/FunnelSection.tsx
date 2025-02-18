
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus, Save, Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Funnel, Stage } from "./types";

interface FunnelSectionProps {
  funnels: Funnel[];
  selectedFunnel: string;
  selectedStage: string;
  setSelectedFunnel: (value: string) => void;
  setSelectedStage: (value: string) => void;
  setIsFunnelDialogOpen: (value: boolean) => void;
  setIsStageDialogOpen: (value: boolean) => void;
  isDefaultConfigSaved?: boolean;
  isEditing?: boolean;
  onSaveDefaultConfig?: () => void;
  onToggleEdit?: () => void;
}

export const FunnelSection = ({
  funnels,
  selectedFunnel,
  selectedStage,
  setSelectedFunnel,
  setSelectedStage,
  setIsFunnelDialogOpen,
  setIsStageDialogOpen,
  isDefaultConfigSaved = false,
  isEditing = false,
  onSaveDefaultConfig,
  onToggleEdit,
}: FunnelSectionProps) => {
  const currentFunnel = funnels.find((f) => f.id === selectedFunnel);
  const showSaveButton = (!isDefaultConfigSaved || isEditing) && selectedFunnel && selectedStage;

  return (
    <Card>
      <CardHeader className="border-b py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Funil do CRM
            </CardTitle>
            <CardDescription>
              Defina o funil e etapa do seu CRM para envio dos novos leads.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => setIsFunnelDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Funil
            </Button>
            <Button
              variant="default"
              onClick={() => setIsStageDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Etapa
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Funil</label>
            <Select
              value={selectedFunnel}
              onValueChange={(value) => {
                if (!isDefaultConfigSaved || isEditing) {
                  setSelectedFunnel(value);
                  setSelectedStage("");
                }
              }}
              disabled={isDefaultConfigSaved && !isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  funnels.length === 0 
                    ? "Clique em 'Novo Funil' para começar"
                    : "Selecione um funil"
                } />
              </SelectTrigger>
              <SelectContent>
                {funnels.map((funnel) => (
                  <SelectItem key={funnel.id} value={funnel.id}>
                    {funnel.name}
                  </SelectItem>
                ))}
                {funnels.length === 0 && (
                  <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                    Nenhum funil cadastrado
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Etapa</label>
            <Select
              value={selectedStage}
              onValueChange={setSelectedStage}
              disabled={(!selectedFunnel || (isDefaultConfigSaved && !isEditing))}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedFunnel
                    ? "Selecione um funil primeiro"
                    : currentFunnel?.stages.length === 0
                    ? "Clique em 'Nova Etapa' para começar"
                    : "Selecione uma etapa"
                } />
              </SelectTrigger>
              <SelectContent>
                {currentFunnel?.stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
                {currentFunnel?.stages.length === 0 && (
                  <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                    Nenhuma etapa cadastrada
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(showSaveButton || isDefaultConfigSaved) && (
          <div className="flex justify-end mt-6">
            {isDefaultConfigSaved && !isEditing ? (
              <Button
                variant="default"
                onClick={onToggleEdit}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Editar Configurações
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={onSaveDefaultConfig}
                className="flex items-center gap-2"
                disabled={!selectedFunnel || !selectedStage}
              >
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
