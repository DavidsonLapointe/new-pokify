
import { Button } from "@/components/ui/button";
import { FinancialTitle } from "@/types/financial";
import { Organization } from "@/types";
import { handleTitlePayment } from "@/services/financial";
import { useToast } from "@/hooks/use-toast";

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

  const handlePayment = async () => {
    try {
      const updatedTitle = await handleTitlePayment(title, organization);
      
      onPaymentSuccess(updatedTitle);

      toast({
        title: "Título baixado com sucesso",
        description: title.type === "pro_rata" 
          ? "O pagamento foi registrado, a organização e o usuário admin foram ativados."
          : "O pagamento foi registrado e o título foi baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao tentar baixar o título.",
        variant: "destructive",
      });
    }
  };

  if (title.status === "pending" || title.status === "overdue") {
    return (
      <Button
        variant="default"
        size="sm"
        className="bg-primary hover:bg-primary/90"
        onClick={handlePayment}
      >
        Baixar Título
      </Button>
    );
  }

  return null;
};
