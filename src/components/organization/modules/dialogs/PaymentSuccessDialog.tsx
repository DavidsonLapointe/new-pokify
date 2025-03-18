
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetupContactInfo } from "../types";

interface PaymentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setupContactInfo: SetupContactInfo;
  onContactInfoChange: (info: Partial<SetupContactInfo>) => void;
  onSubmit: () => void;
}

export const PaymentSuccessDialog: React.FC<PaymentSuccessDialogProps> = ({
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
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Pagamento Confirmado
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p>
            O pagamento foi processado com sucesso! Nossa equipe de operações entrará em contato 
            para realizar o setup do módulo contratado.
          </p>
          
          <div className="bg-green-50 p-3 rounded-md mb-4 text-green-800 text-sm">
            <p className="font-medium mb-1">Próximos passos:</p>
            <p>
              Por favor, informe os dados da pessoa responsável pelo setup do módulo em sua empresa:
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="contactName">Nome do responsável</Label>
              <Input 
                id="contactName" 
                placeholder="Nome completo"
                value={setupContactInfo.name}
                onChange={(e) => onContactInfoChange({name: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="contactPhone">Telefone para contato</Label>
              <Input 
                id="contactPhone" 
                placeholder="(XX) XXXXX-XXXX"
                value={setupContactInfo.phone}
                onChange={(e) => onContactInfoChange({phone: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirmar Informações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
