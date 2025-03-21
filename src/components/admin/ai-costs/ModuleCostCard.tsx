
import { Card, CardContent } from "@/components/ui/card";

interface CostPeriod {
  days: number;
  avgCost: number;
}

interface ModuleCostCardProps {
  moduleName: string;
  costPeriods: CostPeriod[];
  operationDays: number;
}

const ModuleCostCard = ({ moduleName, costPeriods, operationDays }: ModuleCostCardProps) => {
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
                <span className="font-medium">${period.avgCost.toFixed(4)}</span>
              </div>
            ) : null
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCostCard;
