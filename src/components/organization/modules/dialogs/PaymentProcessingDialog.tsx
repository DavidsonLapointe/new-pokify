
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";

interface PaymentProcessingDialogProps {
  open: boolean;
}

export const PaymentProcessingDialog: React.FC<PaymentProcessingDialogProps> = ({
  open
}) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Processando Pagamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-8 flex flex-col items-center">
          <div className="animate-pulse flex flex-col items-center justify-center">
            <CreditCard className="h-16 w-16 text-primary mb-4" />
            <p className="text-center text-lg">Processando seu pagamento...</p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Não feche esta janela. O processo pode levar alguns segundos.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
