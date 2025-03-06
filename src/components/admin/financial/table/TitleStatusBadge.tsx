
import { Badge } from "@/components/ui/badge";
import { TitleStatus } from "@/types/financial";

export const getStatusBadge = (status: TitleStatus) => {
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

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};
