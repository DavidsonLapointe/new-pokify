
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface CostPeriod {
  days: number;
  avgCost: number;
  llmCosts: Array<{ name: string; avgCost: number }>;
}

interface ModuleCostCardProps {
  moduleName: string;
  costPeriods: CostPeriod[];
  operationDays: number;
  exchangeRate: number | null;
}

const ModuleCostCard = ({ 
  moduleName, 
  costPeriods, 
  operationDays,
  exchangeRate 
}: ModuleCostCardProps) => {
  const formatBrlValue = (value: number): string => {
    if (!exchangeRate) return "R$ --.--";
    return `R$ ${(value * exchangeRate).toFixed(2)}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{moduleName}</h3>
        
        <div className="space-y-3">
          {costPeriods.map((period) => (
            period.days <= operationDays ? (
              <div key={`period-${period.days}`} className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {period.days === operationDays 
                    ? `Últimos ${period.days} dias` 
                    : `Últimos ${period.days} dias`}:
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <span className="text-xs font-medium text-muted-foreground mr-1">
                        ${period.avgCost.toFixed(4)}
                      </span>
                      <span className="font-medium">
                        {formatBrlValue(period.avgCost)}
                      </span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 p-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Custo por LLM:</h4>
                      {period.llmCosts.length > 0 ? (
                        <div className="space-y-1">
                          {period.llmCosts.map((llm, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{llm.name}:</span>
                              <div>
                                <span className="text-xs text-muted-foreground mr-1">
                                  ${llm.avgCost.toFixed(4)}
                                </span>
                                <span>
                                  {formatBrlValue(llm.avgCost)}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm pt-1 mt-1 border-t font-medium">
                            <span>Total:</span>
                            <div>
                              <span className="text-xs text-muted-foreground mr-1">
                                ${period.avgCost.toFixed(4)}
                              </span>
                              <span>
                                {formatBrlValue(period.avgCost)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhum detalhe de LLM disponível
                        </p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ) : null
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCostCard;
