
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface LeadStatusBadgeProps {
  status: "active" | "inactive";
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800",
      label: "Ativo",
      tooltip: "Lead ativo que pode ser envolvido em qualquer ferramenta de IA do sistema."
    },
    inactive: {
      color: "bg-red-100 text-red-800",
      label: "Inativo",
      tooltip: "Lead inativo que não será mais contactado por nenhuma ferramenta de IA da empresa."
    }
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${config.color}`}
            >
              {config.label}
            </Badge>
            <Info className="h-3 w-3 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
