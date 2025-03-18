
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SetupContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setupContactInfo: { name: string; phone: string };
  onContactInfoChange: (info: { name?: string; phone?: string }) => void;
  onSubmit: () => void;
}

export const SetupContactDialog: React.FC<SetupContactDialogProps> = ({
  open,
  onOpenChange,
  setupContactInfo,
  onContactInfoChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Setup de Contato</DialogTitle>
          <DialogDescription>
            Informe os dados para que nossa equipe entre em contato e configure o módulo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome completo
            </label>
            <input
              id="name"
              value={setupContactInfo.name}
              onChange={(e) => onContactInfoChange({ name: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone para contato
            </label>
            <input
              id="phone"
              value={setupContactInfo.phone}
              onChange={(e) => onContactInfoChange({ phone: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={onSubmit}>Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
