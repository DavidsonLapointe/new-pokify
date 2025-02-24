
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Barcode } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { TitleStatus } from "@/types/financial";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  value: number;
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  titleId,
  value
}: PaymentMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'boleto' | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const createPayment = async (method: 'pix' | 'boleto') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          titleId,
          paymentMethod: method
        }
      });

      if (error) throw error;
      
      setPaymentDetails(data.paymentDetails);
      return data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      toast.error('Erro ao gerar pagamento. Por favor, tente novamente.');
    }
  };

  const handleMethodSelect = async (method: 'pix' | 'boleto') => {
    setSelectedMethod(method);
    await createPayment(method);
  };

  // Polling para verificar o status do pagamento
  const { data: paymentStatus } = useQuery({
    queryKey: ['payment-status', titleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('financial_titles')
        .select('status')
        .eq('id', titleId)
        .single();
      return data?.status as TitleStatus;
    },
    enabled: !!titleId && open,
    refetchInterval: (data: TitleStatus | undefined) => data === 'paid' ? false : 5000,
    meta: {
      onSuccess: (status: TitleStatus) => {
        if (status === 'paid') {
          toast.success('Pagamento confirmado com sucesso!');
          onOpenChange(false);
        }
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolha o método de pagamento</DialogTitle>
          <DialogDescription>
            Valor a pagar: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)}
          </DialogDescription>
        </DialogHeader>

        {!selectedMethod ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-32 space-y-2"
              onClick={() => handleMethodSelect('pix')}
            >
              <QrCode className="h-8 w-8" />
              <span>PIX</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-32 space-y-2"
              onClick={() => handleMethodSelect('boleto')}
            >
              <Barcode className="h-8 w-8" />
              <span>Boleto</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedMethod === 'pix' && paymentDetails?.qrCode && (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={paymentDetails.qrCode}
                  alt="QR Code PIX"
                  className="w-64 h-64"
                />
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code acima com seu aplicativo de pagamento
                </p>
                <p className="text-xs text-muted-foreground">
                  O QR Code expira em 24 horas
                </p>
              </div>
            )}

            {selectedMethod === 'boleto' && paymentDetails?.pdfUrl && (
              <div className="flex flex-col items-center space-y-4">
                <Button
                  variant="default"
                  onClick={() => window.open(paymentDetails.pdfUrl, '_blank')}
                >
                  Visualizar Boleto
                </Button>
                {paymentDetails.barCode && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Código de barras:</p>
                    <p className="text-xs break-all select-all bg-muted p-2 rounded">
                      {paymentDetails.barCode}
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  O boleto vence em 3 dias úteis
                </p>
              </div>
            )}

            {paymentStatus === 'pending' && (
              <div className="space-y-2">
                <Progress value={0} className="animate-pulse" />
                <p className="text-sm text-center text-muted-foreground">
                  Aguardando confirmação do pagamento...
                </p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSelectedMethod(null)}
            >
              Escolher outro método de pagamento
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
