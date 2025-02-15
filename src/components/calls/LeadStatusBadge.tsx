
import { Badge } from "@/components/ui/badge";

interface LeadStatusBadgeProps {
  status: "active" | "pending";
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${
        status === "active" 
          ? "bg-green-100 text-green-800" 
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status === "active" ? "Ativo" : "Pendente"}
    </Badge>
  );
};
