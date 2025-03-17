
import { Button } from "@/components/ui/button";
import { FinancialTitle } from "@/types/financial";
import { Organization } from "@/types";
import { handleTitlePayment } from "@/services/financial";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface TitlePaymentButtonProps {
  title: FinancialTitle;
  organization: Organization;
  onPaymentSuccess: (updatedTitle: FinancialTitle) => void;
}

export const TitlePaymentButton = ({ 
  title, 
  organization, 
  onPaymentSuccess 
}: TitlePaymentButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const updatedTitle = await handleTitlePayment(title, organization);
      
      onPaymentSuccess(updatedTitle);

      toast({
        title: "Título baixado com sucesso",
        description: title.type === "pro_rata" 
          ? "O pagamento foi registrado e a assinatura foi ativada. A organização será ativada quando todas as etapas forem concluídas."
          : "O pagamento foi registrado e o título foi baixado.",
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao tentar baixar o título.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Apenas exibe o botão se o título estiver pendente ou vencido
  if (title.status === "pending" || title.status === "overdue") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Baixar Título
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar pagamento do título</DialogTitle>
            <DialogDescription>
              Você está prestes a confirmar o pagamento do título no valor de {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(title.value)} para {title.organization?.name}.
              {title.type === "pro_rata" && (
                " Este pagamento também ativará a assinatura da organização."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? "Processando..." : "Confirmar Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Se o título já estiver pago, não exibe nenhum botão
  return null;
};
