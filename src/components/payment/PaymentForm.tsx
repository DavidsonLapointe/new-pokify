
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, CreditCard, RefreshCw } from "lucide-react";

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
    const initStripe = async () => {
      // Clear any existing timeout
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      
      console.log("PaymentForm mounted with clientSecret:", clientSecret ? `${clientSecret.substring(0, 10)}...` : 'undefined');
      
      // Validate requirements
      if (!clientSecret) {
        console.error("Client secret not available");
        setFormError("Client secret not available. Unable to load payment form.");
        return;
      }
      
      // Set a timeout to show error if form doesn't load in 10 seconds
      const timeout = setTimeout(() => {
        if (!formLoaded && clientSecret) {
          console.error("Timeout: Payment form didn't load after 10 seconds");
          setFormError("The payment form didn't load correctly. Try refreshing the page.");
        }
      }, 10000);
      
      setLoadingTimeout(timeout);
      
      // Wait for Stripe and Elements to be ready
      if (!stripe || !elements) {
        console.log("Stripe or Elements not yet available");
        return;
      }
      
      console.log("Stripe, Elements and clientSecret are all available!");
      setStripeReady(true);
      setFormError(null);
    };
    
    initStripe();
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [stripe, elements, clientSecret]);

  // Track when form finishes loading
  const handleFormReady = () => {
    console.log("Payment form loaded and ready");
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    setFormLoaded(true);
  };

  const handleCreatePaymentMethod = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded correctly");
      return;
    }

    try {
      setProcessingPayment(true);
      
      // First validate form elements
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Error validating form:", submitError);
        toast.error(`Error validating card data: ${submitError.message}`);
        return;
      }

      // Create payment method using form elements
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (error) {
        console.error("Error creating payment method:", error);
        toast.error(`Error processing card: ${error.message}`);
        return;
      }

      console.log("Payment method created successfully:", paymentMethod.id);
      
      // Inform parent component of the payment method ID
      onPaymentMethodCreated(paymentMethod.id);
      toast.success("Payment method validated successfully!");
    } catch (err) {
      console.error("Error processing payment data:", err);
      toast.error("An error occurred while processing payment data");
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const handleRefreshPage = () => {
    window.location.reload();
  };

  // Show error state if there's a form error
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
          onClick={handleRefreshPage}
          className="w-full bg-[#9b87f5] hover:bg-[#8a74e8]"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
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
        <div className="py-8 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5] mb-2" />
          <span className="text-gray-600">Carregando formulário de pagamento...</span>
        </div>
      ) : (
        <div className="mb-6 bg-white p-4 rounded-md border border-[#E5DEFF]">
          <PaymentElement 
            onReady={handleFormReady}
            options={{
              layout: 'tabs',
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
              <Loader2 className="h-5 w-5 animate-spin text-[#9b87f5] mr-2" />
              <span className="text-sm text-gray-500">Carregando campos do cartão...</span>
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
