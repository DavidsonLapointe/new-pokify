
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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
  onPaymentSuccess?: () => void;
}

// Payment result modals
interface PaymentResultModalProps {
  open: boolean;
  onClose: () => void;
  packageInfo: {
    name: string;
    credits: number;
  } | null;
}

const PaymentSuccessModal = ({ open, onClose, packageInfo }: PaymentResultModalProps) => {
  if (!packageInfo) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl">Compra realizada com sucesso!</DialogTitle>
          <DialogDescription className="text-center max-w-sm mx-auto">
            Os {packageInfo.credits} créditos do pacote <strong>{packageInfo.name}</strong> já 
            foram adicionados ao seu saldo e estão disponíveis para uso imediato.
          </DialogDescription>
          <Button onClick={onClose} className="mt-4 w-full sm:w-auto">
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PaymentFailureModal = ({ open, onClose, packageInfo }: PaymentResultModalProps) => {
  if (!packageInfo) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl">Pagamento não aprovado</DialogTitle>
          <DialogDescription className="text-center max-w-sm mx-auto">
            Não foi possível processar o pagamento para o pacote <strong>{packageInfo.name}</strong>. 
            Por favor, verifique os dados do cartão e tente novamente ou entre em contato com o 
            suporte caso o problema persista.
          </DialogDescription>
          <Button onClick={onClose} className="mt-4 w-full sm:w-auto">
            Tentar novamente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PaymentForm = ({ onSuccess, onFailure }: { onSuccess: () => void; onFailure: () => void }) => {
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
        redirect: 'if_required'
      });

      if (error) {
        setError(error.message || "Erro no processamento do pagamento");
        toast.error("Erro no pagamento: " + error.message);
        onFailure();
      } else {
        onSuccess();
      }
    } catch (e: any) {
      setError(e.message || "Erro desconhecido ao processar pagamento");
      toast.error("Erro ao processar pagamento");
      onFailure();
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
  onPaymentSuccess
}: PaymentGatewayDialogProps) {
  const [stripeStatus, setStripeStatus] = useState<StripeConfigStatus>(getInitialStripeStatus());
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  
  useEffect(() => {
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
    payment_method_types: ['card'] as string[]
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);
  };

  const handlePaymentFailure = () => {
    setShowFailureModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onOpenChange(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handleFailureModalClose = () => {
    setShowFailureModal(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar compra</DialogTitle>
            <DialogDescription>
              {selectedPackage.name} - {selectedPackage.credits}
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
              <PaymentForm 
                onSuccess={handlePaymentSuccess} 
                onFailure={handlePaymentFailure} 
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>

      {/* Success and Failure Modals */}
      <PaymentSuccessModal 
        open={showSuccessModal} 
        onClose={handleSuccessModalClose} 
        packageInfo={selectedPackage} 
      />
      
      <PaymentFailureModal 
        open={showFailureModal} 
        onClose={handleFailureModalClose} 
        packageInfo={selectedPackage} 
      />
    </>
  );
}
