
import { useState, useEffect } from "react";
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
import { getPaymentMethod, updatePaymentMethod } from "@/services/subscriptionService";

// Obter a chave pública do Stripe de forma mais segura
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51OgQ0mF7m1pQh7H8PgQXHUAwaXA3arTJ4vhRPaXcap3EldT3T3JU4HgQZoqqERWDkKklrDnGCnptSFVKiWrXL7sR00bEOcDlwq';
console.log("PaymentMethodCard - Usando chave pública do Stripe:", stripePublicKey.substring(0, 8) + "...");

// Carregar Stripe apenas uma vez
const stripePromise = loadStripe(stripePublicKey);

interface PaymentMethodCardProps {
  organizationId: string;
  onPaymentMethodUpdated?: () => void;
}

interface PaymentMethodData {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface PaymentMethodFormProps {
  organizationId: string;
  onSuccess?: () => void;
}

const PaymentMethodForm = ({ organizationId, onSuccess }: PaymentMethodFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("PaymentMethodForm mounted with Stripe:", !!stripe);
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe não está disponível. Recarregue a página e tente novamente.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await stripe.createPaymentMethod({
        elements,
        params: {
          billing_details: {},
        },
      });

      if (result.error) {
        setError(result.error.message || "Erro ao salvar cartão");
        toast.error("Erro ao salvar cartão: " + result.error.message);
        return;
      }

      // Atualizar o método de pagamento na assinatura
      const updated = await updatePaymentMethod(organizationId, result.paymentMethod.id);
      
      if (updated) {
        toast.success("Cartão salvo com sucesso!");
        onSuccess?.();
      } else {
        setError("Erro ao atualizar método de pagamento");
        toast.error("Erro ao atualizar método de pagamento");
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

export function PaymentMethodCard({ organizationId, onPaymentMethodUpdated }: PaymentMethodCardProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentMethod = async () => {
    setIsLoading(true);
    try {
      const paymentMethod = await getPaymentMethod(organizationId);
      // Only set if we have all required fields
      if (paymentMethod && paymentMethod.brand && paymentMethod.last4 && 
          paymentMethod.expMonth !== undefined && paymentMethod.expYear !== undefined) {
        setCurrentPaymentMethod({
          brand: paymentMethod.brand,
          last4: paymentMethod.last4,
          expMonth: paymentMethod.expMonth,
          expYear: paymentMethod.expYear
        });
      } else {
        setCurrentPaymentMethod(null);
      }
    } catch (error) {
      console.error("Erro ao buscar método de pagamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethod();
  }, [organizationId]);

  const options = {
    mode: 'setup' as const,
    currency: 'brl',
    appearance: {
      theme: 'stripe' as const,
    },
  };

  const handleSuccess = () => {
    setShowUpdateDialog(false);
    fetchPaymentMethod();
    onPaymentMethodUpdated?.();
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
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : currentPaymentMethod ? (
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
            <PaymentMethodForm organizationId={organizationId} onSuccess={handleSuccess} />
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
              <PaymentMethodForm organizationId={organizationId} onSuccess={handleSuccess} />
            </Elements>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
