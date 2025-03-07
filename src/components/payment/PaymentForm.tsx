
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  isLoading: boolean;
}

export const PaymentForm = ({ onPaymentMethodCreated, isLoading }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setStripeReady(true);
    }
  }, [stripe, elements]);

  const handleCreatePaymentMethod = async () => {
    if (!stripe || !elements) {
      toast.error("O Stripe não está carregado corretamente");
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Primeiro validamos os elementos do formulário
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(`Erro ao validar dados do cartão: ${submitError.message}`);
        return;
      }

      // Criamos um payment method usando os elementos do formulário
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (error) {
        toast.error(`Erro ao processar cartão: ${error.message}`);
        return;
      }

      // Informamos o ID do payment method ao componente pai
      onPaymentMethodCreated(paymentMethod.id);
      toast.success("Método de pagamento validado com sucesso!");
    } catch (err) {
      console.error("Erro ao processar dados de pagamento:", err);
      toast.error("Ocorreu um erro ao processar os dados de pagamento");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
        <h3 className="text-lg font-medium text-[#1A1F2C] flex items-center gap-0.5">
          Dados de Pagamento <span className="text-red-500">*</span>
        </h3>
      </div>
      
      {!stripeReady ? (
        <div className="py-8 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#9b87f5]" />
          <span className="ml-2 text-gray-600">Carregando formulário de pagamento...</span>
        </div>
      ) : (
        <div className="mb-6 bg-white p-4 rounded-md border border-[#E5DEFF]">
          <PaymentElement />
        </div>
      )}

      <Button
        type="button"
        onClick={handleCreatePaymentMethod}
        disabled={!stripe || processingPayment || isLoading || !stripeReady}
        className="w-full bg-[#9b87f5] hover:bg-[#8a74e8]"
      >
        {processingPayment ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validando cartão...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Validar dados do cartão
          </>
        )}
      </Button>
      
      <div className="text-sm text-gray-500 mt-2">
        Seus dados de pagamento são processados de forma segura pelo Stripe.
        Não armazenamos os dados do seu cartão.
      </div>
    </div>
  );
};
