
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Integration } from "@/types/integration";
import { ApiKeyDialog } from "./ApiKeyDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditCentralIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: Integration | null;
  onIntegrationUpdated: (updatedIntegration: Integration) => void;
}

export const EditCentralIntegrationDialog = ({
  open,
  onOpenChange,
  integration,
  onIntegrationUpdated,
}: EditCentralIntegrationDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  useEffect(() => {
    if (integration && open) {
      setName(integration.name);
      setDescription(integration.description || `Integração central com ${integration.name}`);
    }
  }, [integration, open]);

  const handleSave = () => {
    if (!integration || !name) return;
    
    const updatedIntegration: Integration = {
      ...integration,
      name,
      description: description || `Integração central com ${name}`,
    };
    
    onIntegrationUpdated(updatedIntegration);
    onOpenChange(false);
  };

  const handleUpdateApiKey = (apiKey: string) => {
    if (!integration) return;
    
    const updatedIntegration: Integration = {
      ...integration,
      apiKey,
      isConnected: true,
    };
    
    onIntegrationUpdated(updatedIntegration);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Integração Central</DialogTitle>
            <DialogDescription>
              Modifique os detalhes da integração central.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome da Aplicação</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Salesforce, HubSpot, etc."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da integração"
              />
            </div>

            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setIsApiKeyDialogOpen(true)}
              className="w-full"
            >
              {integration?.apiKey ? "Atualizar API Key" : "Configurar API Key"}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSave} disabled={!name}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ApiKeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
        title="Atualizar Chave API"
        onSave={handleUpdateApiKey}
      />
    </>
  );
};
