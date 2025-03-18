
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";

interface PaymentFailedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentFailedDialog: React.FC<PaymentFailedDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Falha no Pagamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p>
            Não foi possível processar seu pagamento. Isso pode acontecer por diversos motivos:
          </p>
          
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Problemas com o cartão de crédito</li>
            <li>Limite insuficiente</li>
            <li>Cartão bloqueado pela administradora</li>
            <li>Problemas temporários no gateway de pagamento</li>
          </ul>
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start text-sm">
            <Mail className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-blue-800">
              Nossa equipe foi notificada sobre o problema e entrará em contato se necessário.
              Você pode tentar novamente mais tarde.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
