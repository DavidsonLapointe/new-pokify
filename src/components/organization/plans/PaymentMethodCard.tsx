import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Usando a chave diretamente do segredo do Supabase
const stripePromise = loadStripe('pk_test_51OgQ0mF7m1pQh7H8PgQXHUAwaXA3arTJ4vhRPaXcap3EldT3T3JU4HgQZoqqERWDkKklrDnGCnptSFVKiWrXL7sR00bEOcDlwq');

interface PaymentMethodCardProps {
  currentPaymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

interface PaymentMethodFormProps {
  onSuccess?: () => void;
}

const PaymentMethodForm = ({ onSuccess }: PaymentMethodFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/organization/plan`,
        },
        redirect: 'if_required', // Evita redirecionamento automático
      });

      if (error) {
        toast.error("Erro ao salvar cartão: " + error.message);
      } else {
        toast.success("Cartão salvo com sucesso!");
        onSuccess?.();
      }
    } catch (e) {
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button disabled={!stripe || isLoading} variant="default" className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando
          </>
        ) : (
          "Salvar cartão"
        )}
      </Button>
    </form>
  );
};

export function PaymentMethodCard({ currentPaymentMethod }: PaymentMethodCardProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const options = {
    mode: 'setup' as const,
    currency: 'brl',
    appearance: {
      theme: 'stripe' as const,
    },
  };

  const handleSuccess = () => {
    setShowUpdateDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Método de Pagamento
        </CardTitle>
        <CardDescription>
          Gerencie seu cartão de crédito cadastrado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentPaymentMethod ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Cartão atual: **** **** **** {currentPaymentMethod.last4}
              </p>
              <p className="text-sm text-muted-foreground">
                Expira em {currentPaymentMethod.expMonth}/{currentPaymentMethod.expYear}
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => setShowUpdateDialog(true)}
            >
              Alterar cartão
            </Button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <PaymentMethodForm onSuccess={handleSuccess} />
          </Elements>
        )}

        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar cartão</DialogTitle>
              <DialogDescription>
                Insira os dados do novo cartão de crédito
              </DialogDescription>
            </DialogHeader>
            <Elements stripe={stripePromise} options={options}>
              <PaymentMethodForm onSuccess={handleSuccess} />
            </Elements>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
