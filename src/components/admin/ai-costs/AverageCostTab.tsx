
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ModuleCostCard from "./ModuleCostCard";
import { calculateAverageCosts, getOperationDays, type AIExecution } from "./utils";

const AverageCostTab = ({ mockAIExecutions }: { mockAIExecutions: AIExecution[] }) => {
  // Fetch AI executions data
  const { data: aiExecutions, isLoading } = useQuery({
    queryKey: ['ai-executions'],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return mockAIExecutions;
    }
  });

  // Define the periods we want to calculate (10, 30, 60, 120 days)
  const periodDays = [10, 30, 60, 120];
  
  // Calculate operation days
  const operationDays = aiExecutions ? getOperationDays(aiExecutions) : 0;
  
  // Calculate average costs
  const moduleAverageCosts = aiExecutions 
    ? calculateAverageCosts(aiExecutions, periodDays)
    : [];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full">
            <Skeleton className="h-[180px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {moduleAverageCosts.map((module) => (
        <ModuleCostCard 
          key={module.moduleName}
          moduleName={module.moduleName}
          costPeriods={module.costPeriods}
          operationDays={operationDays}
        />
      ))}
      
      {moduleAverageCosts.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          Nenhum dado de custo disponível para análise.
        </div>
      )}
    </div>
  );
};

export default AverageCostTab;
