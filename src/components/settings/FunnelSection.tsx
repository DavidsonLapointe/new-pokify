
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Save, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FunnelSectionProps {
  funnelName: string;
  stageName: string;
  setFunnelName: (value: string) => void;
  setStageName: (value: string) => void;
  isDefaultConfigSaved?: boolean;
  isEditing?: boolean;
  onSaveDefaultConfig?: () => void;
  onToggleEdit?: () => void;
}

export const FunnelSection = ({
  funnelName,
  stageName,
  setFunnelName,
  setStageName,
  isDefaultConfigSaved = false,
  isEditing = false,
  onSaveDefaultConfig,
  onToggleEdit,
}: FunnelSectionProps) => {
  return (
    <Card>
      <CardHeader className="border-b py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-[#9b87f5]" />
              Funil do CRM
            </CardTitle>
            <CardDescription>
              Defina o funil e etapa do seu CRM para envio dos novos leads.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Funil</label>
            <Input
              placeholder="Ex: Funil de Vendas"
              value={funnelName}
              onChange={(e) => setFunnelName(e.target.value)}
              disabled={isDefaultConfigSaved && !isEditing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Etapa</label>
            <Input
              placeholder="Ex: Qualificação"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              disabled={isDefaultConfigSaved && !isEditing}
            />
          </div>
        </div>

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
              disabled={!funnelName || !stageName}
            >
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
