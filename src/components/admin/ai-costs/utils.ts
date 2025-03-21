
import { subDays } from "date-fns";

export interface AIExecution {
  id: string;
  toolName: string;
  modelName: string;
  organizationName: string;
  executionDate: Date;
  llmDetails: Array<{ name: string; cost: number }>;
  totalCost: number;
}

export interface ModuleAverageCost {
  moduleName: string;
  costPeriods: Array<{
    days: number;
    avgCost: number;
  }>;
}

export const calculateAverageCosts = (
  executions: AIExecution[],
  periodDays: number[]
): ModuleAverageCost[] => {
  // Get unique module names
  const moduleNames = [...new Set(executions.map(exec => exec.toolName))];
  
  // Get current date to calculate periods
  const now = new Date();
  
  // Calculate system operation days
  let oldestExecution = executions.length > 0 
    ? executions.reduce((oldest, current) => 
        current.executionDate < oldest.executionDate ? current : oldest
      ).executionDate
    : now;
  
  const operationDays = Math.ceil((now.getTime() - oldestExecution.getTime()) / (1000 * 60 * 60 * 24));
  
  // Create period thresholds: 10, 30, 60, 120 days
  const availablePeriods = periodDays.filter(days => days <= operationDays);
  
  // Calculate average costs for each module and period
  return moduleNames.map(moduleName => {
    const moduleCosts = availablePeriods.map(days => {
      const periodStartDate = subDays(now, days);
      
      // Filter executions for this module and period
      const periodExecutions = executions.filter(exec => 
        exec.toolName === moduleName && 
        exec.executionDate >= periodStartDate
      );
      
      // Calculate average cost
      const totalCost = periodExecutions.reduce((sum, exec) => sum + exec.totalCost, 0);
      const avgCost = periodExecutions.length > 0 ? totalCost / periodExecutions.length : 0;
      
      return {
        days,
        avgCost
      };
    });
    
    return {
      moduleName,
      costPeriods: moduleCosts,
      operationDays
    };
  });
};

export const getOperationDays = (executions: AIExecution[]): number => {
  if (executions.length === 0) return 0;
  
  const now = new Date();
  const oldestExecution = executions.reduce((oldest, current) => 
    current.executionDate < oldest.executionDate ? current : oldest
  ).executionDate;
  
  return Math.ceil((now.getTime() - oldestExecution.getTime()) / (1000 * 60 * 60 * 24));
};
