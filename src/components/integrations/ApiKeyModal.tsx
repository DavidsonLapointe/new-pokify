
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
import { getContactType } from "@/constants/integrations";

interface ApiKeyModalProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (apiKey: string, contactValue?: string) => void;
}

export const ApiKeyModal = ({ integration, isOpen, onClose, onConfirm }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [contactValue, setContactValue] = useState("");
  
  const contactType = integration.type === "call" ? getContactType(integration.id) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(apiKey, contactValue);
    setApiKey("");
    setContactValue("");
  };

  const getContactPlaceholder = () => {
    if (contactType === "email") return "Insira seu email";
    if (contactType === "phone") return "Insira seu telefone";
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    }
    
    setContactValue(value);
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

          {contactType && (
            <div className="space-y-2">
              <label htmlFor="contactValue" className="text-sm font-medium">
                {contactType === "email" ? "Email" : "Telefone"}
              </label>
              <Input
                id="contactValue"
                type={contactType === "email" ? "email" : "tel"}
                value={contactValue}
                onChange={contactType === "phone" ? handlePhoneChange : (e) => setContactValue(e.target.value)}
                placeholder={getContactPlaceholder()}
                pattern={contactType === "email" ? undefined : "\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}"}
                required
              />
            </div>
          )}

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
