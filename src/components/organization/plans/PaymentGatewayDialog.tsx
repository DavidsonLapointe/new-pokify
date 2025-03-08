
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, AlertCircle, QrCode, FileText, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { 
  stripePromise, 
  validateStripeConfig,
  getInitialStripeStatus,
  type StripeConfigStatus
} from "@/utils/stripeUtils";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

// Componente para exibir detalhes do PIX
const PixPaymentDetails = ({ 
  qrCodeUrl, 
  expiresAt 
}: { 
  qrCodeUrl: string;
  expiresAt: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
        <div className="mb-3">
          <QrCode className="h-6 w-6 text-primary mb-1" />
          <h3 className="text-sm font-medium">QR Code PIX</h3>
        </div>
        <div className="border p-2 rounded-md w-64 h-64 flex items-center justify-center">
          <img 
            src={qrCodeUrl} 
            alt="QR Code PIX" 
            className="max-w-full max-h-full"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              toast.error("Erro ao carregar QR Code");
            }}
          />
        </div>
        <a 
          href={qrCodeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary text-sm mt-2 flex items-center"
        >
          Abrir em nova janela
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      <div className="text-sm text-gray-500">
        <p>O código PIX expira em: {new Date(expiresAt).toLocaleString()}</p>
        <p className="mt-2">Após o pagamento, o sistema atualizará automaticamente seu cadastro.</p>
      </div>
    </div>
  );
};

// Componente para exibir detalhes do Boleto
const BoletoPaymentDetails = ({ 
  boletoUrl, 
  barCode 
}: { 
  boletoUrl: string;
  barCode?: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-md">
        <div className="flex items-center mb-3">
          <FileText className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-sm font-medium">Boleto Bancário</h3>
        </div>
        
        {barCode && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-1">Código de barras:</p>
            <p className="text-sm bg-white p-2 border rounded-md overflow-x-auto whitespace-nowrap">
              {barCode}
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            asChild
            variant="outline"
            className="w-full"
          >
            <a 
              href={boletoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Visualizar Boleto
            </a>
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        <p>O boleto tem vencimento em 3 dias úteis.</p>
        <p className="mt-2">Após o pagamento, o sistema atualizará automaticamente seu cadastro em até 3 dias úteis.</p>
      </div>
    </div>
  );
};

export function PaymentGatewayDialog({
  open,
  onOpenChange,
  package: selectedPackage,
}: PaymentGatewayDialogProps) {
  const [stripeStatus, setStripeStatus] = useState<StripeConfigStatus>(getInitialStripeStatus());
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixDetails, setPixDetails] = useState<{ qrCodeUrl: string; expiresAt: string } | null>(null);
  const [boletoDetails, setBoletoDetails] = useState<{ boletoUrl: string; barCode?: string } | null>(null);
  
  useEffect(() => {
    // Verificar a configuração do Stripe sempre que o diálogo abrir
    if (open) {
      checkStripeConfig();
      // Reset payment details when dialog opens
      setPixDetails(null);
      setBoletoDetails(null);
      setPaymentMethod('card');
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
    payment_method_types: ['card'] as const
  };

  const handleSuccess = () => {
    onOpenChange(false);
    toast.success("Pagamento confirmado! Os créditos foram adicionados à sua conta.");
  };

  const handleAlternativePayment = async (method: 'pix' | 'boleto') => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    
    try {
      // Simulação de chamada à API para criar pagamento alternativo
      // Na implementação real, seria uma chamada ao Edge Function create-payment
      const response = await fetch(`${window.location.origin}/api/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          method,
          productId: selectedPackage.name
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao gerar pagamento');
      }
      
      const result = await response.json();
      
      if (method === 'pix') {
        setPixDetails({
          qrCodeUrl: result.qrCodeUrl || 'https://via.placeholder.com/300',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      } else if (method === 'boleto') {
        setBoletoDetails({
          boletoUrl: result.boletoUrl || 'https://via.placeholder.com/300',
          barCode: result.barCode || '12345678901234567890123456789012345678901234'
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao gerar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethod = () => {
    if (paymentMethod === 'card' && stripeStatus.valid) {
      return (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onSuccess={handleSuccess} />
        </Elements>
      );
    } else if (paymentMethod === 'pix') {
      if (pixDetails) {
        return <PixPaymentDetails qrCodeUrl={pixDetails.qrCodeUrl} expiresAt={pixDetails.expiresAt} />;
      } else {
        return (
          <Button 
            onClick={() => handleAlternativePayment('pix')} 
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Gerar QR Code PIX
              </>
            )}
          </Button>
        );
      }
    } else if (paymentMethod === 'boleto') {
      if (boletoDetails) {
        return <BoletoPaymentDetails boletoUrl={boletoDetails.boletoUrl} barCode={boletoDetails.barCode} />;
      } else {
        return (
          <Button 
            onClick={() => handleAlternativePayment('boleto')} 
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando boleto...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Boleto Bancário
              </>
            )}
          </Button>
        );
      }
    }
    
    return null;
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
        ) : !stripeStatus.valid && paymentMethod === 'card' ? (
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
          <>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'pix' | 'boleto')}
              className="grid grid-cols-3 gap-4 mb-4"
            >
              <div>
                <RadioGroupItem 
                  value="card" 
                  id="card" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Cartão</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="pix" 
                  id="pix" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="pix"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <QrCode className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">PIX</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="boleto" 
                  id="boleto" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="boleto"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <FileText className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Boleto</span>
                </Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-4">
              {renderPaymentMethod()}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
