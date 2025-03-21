
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface CostPeriod {
  days: number;
  avgCost: number;
}

interface ModuleCostCardProps {
  moduleName: string;
  costPeriods: CostPeriod[];
  operationDays: number;
}

// Mock function to fetch USD to BRL exchange rate - in a real app, this would be an API call
const fetchExchangeRate = async (): Promise<number> => {
  // Simulating API call with a fixed rate, in production this would be real data
  await new Promise(resolve => setTimeout(resolve, 500));
  return 5.15; // Example exchange rate (1 USD = 5.15 BRL)
};

const ModuleCostCard = ({ moduleName, costPeriods, operationDays }: ModuleCostCardProps) => {
  // Fetch the current USD to BRL exchange rate
  const { data: exchangeRate, isLoading } = useQuery({
    queryKey: ['exchange-rate'],
    queryFn: fetchExchangeRate,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Default exchange rate if loading
  const currentRate = exchangeRate || 5.15;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{moduleName}</h3>
        
        <div className="space-y-3">
          {costPeriods.map((period) => (
            period.days <= operationDays ? (
              <div key={`period-${period.days}`} className="flex flex-col gap-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {period.days === operationDays 
                    ? `Últimos ${period.days} dias` 
                    : `Últimos ${period.days} dias`}:
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Custo médio:</span>
                  <div className="flex gap-2 items-center">
                    <span className="font-medium">${period.avgCost.toFixed(4)}</span>
                    <span className="text-sm text-muted-foreground">|</span>
                    <span className="font-medium">
                      {isLoading ? "..." : `R$ ${(period.avgCost * currentRate).toFixed(2)}`}
                    </span>
                  </div>
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
