
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  isLoading: boolean;
  clientSecret?: string;
}

export const PaymentForm = ({ onPaymentMethodCreated, isLoading, clientSecret }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoaded, setFormLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("PaymentForm montado com clientSecret:", clientSecret?.substring(0, 10) + "...");
    
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    // Set a timeout to show error if form doesn't load in 10 seconds
    const timeout = setTimeout(() => {
      if (!formLoaded && clientSecret) {
        console.error("Timeout: Form de pagamento não carregou após 10 segundos");
        setFormError("O formulário de pagamento não carregou corretamente. Tente atualizar a página.");
      }
    }, 10000);
    
    setLoadingTimeout(timeout);
    
    // Verificamos explicitamente se todos os componentes necessários estão disponíveis
    if (!clientSecret) {
      console.log("Client secret não disponível");
      setFormError("Client secret não disponível. Não é possível carregar o formulário de pagamento.");
      return;
    }

    if (!stripe || !elements) {
      console.log("Stripe ou Elements ainda não estão disponíveis");
      return;
    }
    
    console.log("Stripe, Elements e clientSecret estão todos disponíveis!");
    setStripeReady(true);
    setFormError(null);
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [stripe, elements, clientSecret]);

  // Verificamos quando o formulário termina de carregar
  const handleFormReady = () => {
    console.log("Formulário de pagamento carregado e pronto");
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    setFormLoaded(true);
  };

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
        console.error("Erro ao validar formulário:", submitError);
        toast.error(`Erro ao validar dados do cartão: ${submitError.message}`);
        return;
      }

      // Criamos um payment method usando os elementos do formulário
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (error) {
        console.error("Erro ao criar payment method:", error);
        toast.error(`Erro ao processar cartão: ${error.message}`);
        return;
      }

      console.log("Payment method criado com sucesso:", paymentMethod.id);
      
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

  // Se estamos em um estado de erro, mostrar mensagem de erro
  if (formError) {
    return (
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
          <h3 className="text-lg font-medium text-[#1A1F2C] flex items-center gap-0.5">
            Dados de Pagamento <span className="text-red-500">*</span>
          </h3>
        </div>
        
        <div className="py-6 px-4 bg-red-50 border border-red-100 rounded-md text-center">
          <p className="text-red-600 font-medium">{formError}</p>
          <p className="text-red-500 mt-2 text-sm">
            Tente atualizar a página ou entre em contato com o suporte se o problema persistir.
          </p>
        </div>
        
        <Button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full bg-[#9b87f5] hover:bg-[#8a74e8]"
        >
          Atualizar página
        </Button>
      </div>
    );
  }

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
          <PaymentElement 
            onReady={handleFormReady}
            options={{
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: false,
                spacedAccordionItems: false
              },
              fields: {
                billingDetails: {
                  name: 'never',
                  email: 'never',
                  phone: 'never',
                  address: {
                    country: 'never',
                    postalCode: 'never',
                    line1: 'never',
                    line2: 'never',
                    city: 'never',
                    state: 'never',
                  },
                },
              },
              wallets: {
                applePay: 'never',
                googlePay: 'never'
              }
            }}
          />
          
          {!formLoaded && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-[#9b87f5]" />
              <span className="ml-2 text-sm text-gray-500">Carregando campos do cartão...</span>
            </div>
          )}
        </div>
      )}

      <Button
        type="button"
        onClick={handleCreatePaymentMethod}
        disabled={!stripe || processingPayment || isLoading || !stripeReady || !formLoaded}
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
