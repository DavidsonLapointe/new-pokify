
import { Badge } from "@/components/ui/badge";
import { TitleStatus } from "@/types/financial";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: TitleStatus;
  paymentStatusDetails?: string;
}

export const getStatusBadge = ({ status, paymentStatusDetails }: StatusBadgeProps) => {
  // Atualizando as variantes para cada status
  const variants: Record<TitleStatus, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline", // Amarelo para Pendente
    paid: "default",    // Verde para Pago
    overdue: "destructive", // Vermelho para Vencido
  };

  const labels: Record<TitleStatus, string> = {
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
  };

  // Classes personalizadas para cada status
  const customClasses: Record<TitleStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
    paid: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
    overdue: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  };

  // Se tiver detalhes de status e estiver vencido, exibir tooltip
  if (status === "overdue" && paymentStatusDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Badge variant={variants[status]} className={customClasses[status]}>
                {labels[status]}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Detalhe: {paymentStatusDetails}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Caso contrário, apenas retornar o badge
  return (
    <Badge variant={variants[status]} className={customClasses[status]}>
      {labels[status]}
    </Badge>
  );
};
