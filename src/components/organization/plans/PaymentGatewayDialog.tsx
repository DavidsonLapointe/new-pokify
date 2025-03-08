
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { 
  stripePromise, 
  validateStripeConfig,
  getInitialStripeStatus,
  type StripeConfigStatus
} from "@/utils/stripeUtils";

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
        options={{
          paymentMethodOrder: ['card'],
          wallets: {
            googlePay: 'never',
            applePay: 'never'
          }
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
  const [stripeStatus, setStripeStatus] = useState<StripeConfigStatus>(getInitialStripeStatus());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar a configuração do Stripe sempre que o diálogo abrir
    if (open) {
      checkStripeConfig();
    }
  }, [open]);

  const checkStripeConfig = async () => {
    setLoading(true);
    try {
      const status = await validateStripeConfig();
      setStripeStatus(status);
    } catch (error) {
      console.error("Erro ao verificar configuração do Stripe:", error);
      setStripeStatus({
        valid: false,
        message: "Erro ao verificar configuração do Stripe"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPackage) return null;

  const options = {
    mode: 'payment' as const,
    currency: 'brl',
    amount: selectedPackage.price * 100,
    appearance: {
      theme: 'stripe' as const,
    },
    // Correct way to define allowed payment methods
    payment_method_types: ['card']
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
        
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !stripeStatus.valid ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro na configuração do Stripe</h3>
                <p className="text-xs mt-1 text-red-700">{stripeStatus.message}</p>
                <p className="text-xs mt-2 text-red-700">
                  Para que o Stripe funcione corretamente, certifique-se de que a chave pública do Stripe 
                  está configurada corretamente nas variáveis de ambiente do Supabase.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm onSuccess={handleSuccess} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
