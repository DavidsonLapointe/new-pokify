
import { Card, CardContent } from "@/components/ui/card";

interface CostPeriod {
  days: number;
  avgCost: number;
}

interface ModuleCostCardProps {
  moduleName: string;
  costPeriods: CostPeriod[];
  operationDays: number;
  exchangeRate: number;
}

const ModuleCostCard = ({ 
  moduleName, 
  costPeriods, 
  operationDays,
  exchangeRate
}: ModuleCostCardProps) => {
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    ${period.avgCost.toFixed(4)}
                  </span>
                  <span className="text-muted-foreground">|</span>
                  <span className="font-medium">
                    R$ {(period.avgCost * exchangeRate).toFixed(2)}
                  </span>
                </div>
              </div>
            ) : null
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCostCard;
