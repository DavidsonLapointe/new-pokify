
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
              Define o funil e etapa padrão para novos leads no CRM
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-[#000000e6] hover:bg-black/80"
              onClick={() => setIsFunnelDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Funil
            </Button>
            <Button
              className="bg-[#000000e6] hover:bg-black/80"
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
            {funnels.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-gray-500">
                  Nenhum funil cadastrado. Clique em "Novo Funil" para começar.
                </p>
              </div>
            ) : (
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
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Etapa</label>
            {!selectedFunnel ? (
              <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-gray-500">
                  Selecione um funil primeiro para ver as etapas disponíveis
                </p>
              </div>
            ) : currentFunnel?.stages.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-gray-500">
                  Nenhuma etapa cadastrada. Clique em "Nova Etapa" para começar.
                </p>
              </div>
            ) : (
              <Select
                value={selectedStage}
                onValueChange={setSelectedStage}
                disabled={(!selectedFunnel || (isDefaultConfigSaved && !isEditing))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma etapa" />
                </SelectTrigger>
                <SelectContent>
                  {currentFunnel?.stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {(showSaveButton || isDefaultConfigSaved) && (
          <div className="flex justify-end mt-6">
            {isDefaultConfigSaved && !isEditing ? (
              <Button
                variant="outline"
                onClick={onToggleEdit}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Editar Configurações
              </Button>
            ) : (
              <Button
                onClick={onSaveDefaultConfig}
                className="bg-[#000000e6] hover:bg-black/80 flex items-center gap-2"
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
