
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  isLoading: boolean;
}

export const PaymentForm = ({ onPaymentMethodCreated, isLoading }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await elements.submit();
    
    if (result.error) {
      toast.error("Erro ao processar pagamento: " + result.error.message);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (error) {
      toast.error("Erro ao criar método de pagamento: " + error.message);
      return;
    }

    onPaymentMethodCreated(paymentMethod.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
        <h3 className="text-lg font-medium text-[#1A1F2C] flex items-center gap-0.5">
          Dados de Pagamento <span>*</span>
        </h3>
      </div>
      
      <PaymentElement />

      <div className="text-sm text-gray-500 mt-4">
        Seus dados de pagamento são processados de forma segura pelo Stripe.
      </div>
    </form>
  );
};
