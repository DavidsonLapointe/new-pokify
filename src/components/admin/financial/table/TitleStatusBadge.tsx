
import { Badge } from "@/components/ui/badge";
import { TitleStatus } from "@/types/financial";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: TitleStatus;
  paymentStatusDetails?: string;
}

export const getStatusBadge = ({ status, paymentStatusDetails }: StatusBadgeProps) => {
  const variants: Record<TitleStatus, "default" | "secondary" | "destructive"> = {
    pending: "default",
    paid: "secondary",
    overdue: "destructive",
  };

  const labels: Record<TitleStatus, string> = {
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
  };

  // Se tiver detalhes de status e estiver vencido, exibir tooltip
  if (status === "overdue" && paymentStatusDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Badge variant={variants[status]}>
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
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};
