
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Integration } from "@/types/integration";

interface ApiKeyModalProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (apiKey: string) => void;
}

export const ApiKeyModal = ({ integration, isOpen, onClose, onConfirm }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(apiKey);
    setApiKey("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar {integration.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Chave API
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Insira sua chave API"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Concluir</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
