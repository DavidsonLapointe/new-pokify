
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Obter a chave pública do Stripe de forma mais segura
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51OgQ0mF7m1pQh7H8PgQXHUAwaXA3arTJ4vhRPaXcap3EldT3T3JU4HgQZoqqERWDkKklrDnGCnptSFVKiWrXL7sR00bEOcDlwq';
console.log("PaymentGatewayDialog - Usando chave pública do Stripe:", stripePublicKey.substring(0, 8) + "...");

// Carregar Stripe apenas uma vez
const stripePromise = loadStripe(stripePublicKey);

interface PaymentGatewayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: {
    name: string;
    credits: number;
    price: number;
  } | null;
}

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("PaymentForm component mounted with Stripe:", !!stripe);
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe não está disponível. Recarregue a página e tente novamente.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/organization/plan`,
        },
      });

      if (error) {
        setError(error.message || "Erro no processamento do pagamento");
        toast.error("Erro no pagamento: " + error.message);
      } else {
        onSuccess();
      }
    } catch (e: any) {
      setError(e.message || "Erro desconhecido ao processar pagamento");
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      <PaymentElement 
        onLoadError={(event) => {
          console.error("PaymentElement load error:", event);
          setError(event.error?.message || "Erro ao carregar formulário de pagamento");
        }}
      />
      <Button disabled={!stripe || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pagar com cartão
          </>
        )}
      </Button>
    </form>
  );
};

export function PaymentGatewayDialog({
  open,
  onOpenChange,
  package: selectedPackage,
}: PaymentGatewayDialogProps) {
  if (!selectedPackage) return null;

  const options = {
    mode: 'payment' as const,
    currency: 'brl',
    amount: selectedPackage.price * 100,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  const handleSuccess = () => {
    onOpenChange(false);
    toast.success("Pagamento confirmado! Os créditos foram adicionados à sua conta.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar compra</DialogTitle>
          <DialogDescription>
            {selectedPackage.name} - {selectedPackage.credits} créditos
            <br />
            Valor: R$ {selectedPackage.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onSuccess={handleSuccess} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
