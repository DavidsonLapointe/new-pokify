
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
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
import { 
  stripePromise, 
  validateStripeConfig, 
  getInitialStripeStatus, 
  type StripeConfigStatus 
} from "@/utils/stripeUtils";

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
        options={{
          paymentMethodOrder: ['card'],
          wallets: {
            googlePay: 'never',
            applePay: 'never'
          }
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
  const [stripeStatus, setStripeStatus] = useState<StripeConfigStatus>(getInitialStripeStatus());

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
    
    // Verificar configuração do Stripe
    const checkStripeConfig = async () => {
      const status = await validateStripeConfig();
      setStripeStatus(status);
    };
    
    checkStripeConfig();
  }, [organizationId]);

  const options = {
    mode: 'setup' as const,
    currency: 'brl',
    appearance: {
      theme: 'stripe' as const,
    },
    payment_method_types: ['card'],
    payment_method_options: {
      googlePay: { enabled: false },
      applePay: { enabled: false }
    }
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
        {!stripeStatus.valid ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro na configuração do Stripe</h3>
                <p className="text-xs mt-1 text-red-700">{stripeStatus.message}</p>
                <p className="text-xs mt-2 text-red-700">
                  Para que o Stripe funcione corretamente, certifique-se de que a variável de ambiente 
                  STRIPE_PUBLIC_KEY está configurada corretamente nas variáveis de ambiente do Supabase.
                </p>
              </div>
            </div>
          </div>
        ) : isLoading ? (
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
          stripeStatus.valid && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentMethodForm organizationId={organizationId} onSuccess={handleSuccess} />
            </Elements>
          )
        )}

        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar cartão</DialogTitle>
              <DialogDescription>
                Insira os dados do novo cartão de crédito
              </DialogDescription>
            </DialogHeader>
            {stripeStatus.valid ? (
              <Elements stripe={stripePromise} options={options}>
                <PaymentMethodForm organizationId={organizationId} onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Erro na configuração do Stripe</h3>
                    <p className="text-xs mt-1 text-red-700">{stripeStatus.message}</p>
                    <p className="text-xs mt-2 text-red-700">
                      Para que o Stripe funcione corretamente, certifique-se de que a variável de ambiente 
                      STRIPE_PUBLIC_KEY está configurada corretamente nas variáveis de ambiente do Supabase.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
