
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Integration } from "@/types/integration";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateCentralIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIntegrationCreated: (integration: Integration) => void;
}

export const CreateCentralIntegrationDialog = ({
  open,
  onOpenChange,
  onIntegrationCreated,
}: CreateCentralIntegrationDialogProps) => {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSave = () => {
    if (!name) return;
    
    const newIntegration: Integration = {
      id: uuidv4(),
      name,
      type: "crm",
      description: `Integração central com ${name}`,
      isConnected: !!apiKey,
      apiKey: apiKey || undefined,
    };
    
    onIntegrationCreated(newIntegration);
    handleReset();
  };

  const handleReset = () => {
    setName("");
    setApiKey("");
    setShowApiKeyInput(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Integração Central</DialogTitle>
          <DialogDescription>
            Configure uma integração que afetará todo o sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da Aplicação</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Salesforce, HubSpot, etc."
            />
          </div>

          {showApiKeyInput ? (
            <div className="grid gap-2">
              <Label htmlFor="apiKey">Chave API</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Insira sua chave API"
              />
            </div>
          ) : (
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setShowApiKeyInput(true)}
              className="w-full"
            >
              Configurar API Key
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSave} disabled={!name}>
            Concluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
