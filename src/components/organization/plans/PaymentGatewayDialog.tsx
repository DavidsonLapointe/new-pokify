
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentGatewayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: {
    name: string;
    credits: number;
    price: number;
  } | null;
}

export function PaymentGatewayDialog({
  open,
  onOpenChange,
  package: selectedPackage,
}: PaymentGatewayDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | null>(null);

  if (!selectedPackage) return null;

  const handlePayment = (method: 'credit' | 'pix') => {
    setPaymentMethod(method);
    // Aqui você implementaria a integração real com o gateway de pagamento
    toast.success(`Processando pagamento via ${method === 'credit' ? 'cartão de crédito' : 'PIX'}...`);
    setTimeout(() => {
      onOpenChange(false);
      setPaymentMethod(null);
      toast.success("Pagamento confirmado! Os créditos foram adicionados à sua conta.");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolha a forma de pagamento</DialogTitle>
          <DialogDescription>
            {selectedPackage.name} - {selectedPackage.credits} créditos
            <br />
            Valor: R$ {selectedPackage.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => handlePayment('credit')}
            disabled={!!paymentMethod}
          >
            <CreditCard className="h-8 w-8" />
            <span className="text-sm font-medium">Cartão de Crédito</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => handlePayment('pix')}
            disabled={!!paymentMethod}
          >
            <QrCode className="h-8 w-8" />
            <span className="text-sm font-medium">PIX</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
