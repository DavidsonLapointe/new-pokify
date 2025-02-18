
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

const stripePromise = loadStripe("pk_test_your_key");

interface PaymentMethodCardProps {
  currentPaymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

const PaymentMethodForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/organization/plan`,
        },
      });

      if (error) {
        toast.error("Erro ao salvar cartão: " + error.message);
      } else {
        toast.success("Cartão salvo com sucesso!");
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
      <Button disabled={!stripe || isLoading} className="w-full">
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
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const options = {
    mode: 'setup' as const,
    currency: 'brl',
    appearance: {
      theme: 'stripe' as const,
    },
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
          <div className="space-y-4">
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
                onClick={() => setShowUpdateForm(true)}
              >
                Alterar cartão
              </Button>
            </div>

            {showUpdateForm && (
              <div className="mt-4 pt-4 border-t">
                <Elements stripe={stripePromise} options={options}>
                  <PaymentMethodForm />
                </Elements>
              </div>
            )}
          </div>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <PaymentMethodForm />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
}
