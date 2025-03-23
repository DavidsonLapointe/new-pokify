
import { Call } from "@/types/calls";
import { Badge } from "@/components/ui/badge";
import { Flame, Thermometer, Snowflake } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { getLastCallTemperature, temperatureConfig } from "./utils";

export interface LeadTemperatureBadgeProps {
  calls: Call[];
  hasProcessed: boolean;
}

export const LeadTemperatureBadge = ({ calls, hasProcessed }: LeadTemperatureBadgeProps) => {
  // Se não tiver chamadas processadas, mostra um badge neutro
  if (!hasProcessed) {
    return <span className="text-xs text-gray-400">Não disponível</span>;
  }

  // Obtém a temperatura do lead
  const temperature = getLastCallTemperature(calls);
  
  if (!temperature) {
    return <span className="text-xs text-gray-400">Não analisado</span>;
  }

  // Obtém a configuração de exibição para a temperatura
  const config = temperatureConfig[temperature];
  
  // Determina qual ícone usar com base na temperatura
  const Icon = temperature === 'hot' 
    ? Flame 
    : temperature === 'warm'
      ? Thermometer
      : Snowflake;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${config.color} px-2 py-0.5 cursor-help`}
          >
            <Icon className="h-3 w-3 mr-1.5" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">
            {temperature === 'hot' 
              ? 'Lead demonstrou grande interesse no produto.' 
              : temperature === 'warm'
                ? 'Lead demonstrou interesse moderado no produto.'
                : 'Lead apresenta baixo interesse no momento.'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
