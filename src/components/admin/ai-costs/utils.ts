
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
    llmCosts: Array<{ name: string; avgCost: number }>;
  }>;
}

// Mock data for AI executions
export const mockAverageCostData: AIExecution[] = [
  // Lead Analyzer executions
  ...Array(80).fill(null).map((_, index) => ({
    id: `la-${index + 1}`,
    toolName: "Lead Analyzer",
    modelName: index % 3 === 0 ? "GPT-4o" : (index % 3 === 1 ? "Claude 3 Opus" : "GPT-4 Turbo"),
    organizationName: ["Acme Inc", "TechCorp", "Global Services", "DataSystems"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 100)),
    llmDetails: [
      { 
        name: "TokenProcessing", 
        cost: 0.0006 + (Math.random() * 0.0010)
      },
      { 
        name: "EmbeddingGeneration", 
        cost: 0.0004 + (Math.random() * 0.0008)
      }
    ],
    totalCost: 0.0015 + (Math.random() * 0.0025)
  })),
  
  // Email Generator executions
  ...Array(65).fill(null).map((_, index) => ({
    id: `eg-${index + 1}`,
    toolName: "Email Generator",
    modelName: index % 2 === 0 ? "Claude 3 Sonnet" : "GPT-4o-mini",
    organizationName: ["BizCorp", "Tech Solutions", "Acme Inc", "DataSystems"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 90)),
    llmDetails: [
      { 
        name: "TokenProcessing", 
        cost: 0.0003 + (Math.random() * 0.0005)
      },
      { 
        name: "TemplateGeneration", 
        cost: 0.0002 + (Math.random() * 0.0004)
      }
    ],
    totalCost: 0.0008 + (Math.random() * 0.0012)
  })),
  
  // Call Transcriber executions
  ...Array(50).fill(null).map((_, index) => ({
    id: `ct-${index + 1}`,
    toolName: "Call Transcriber",
    modelName: index % 3 === 0 ? "Whisper Large" : (index % 3 === 1 ? "GPT-4o Voice" : "Claude 3 Opus"),
    organizationName: ["TechCorp", "Global Services", "FastSales", "TalkTech"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 80)),
    llmDetails: [
      { 
        name: "AudioProcessing", 
        cost: 0.0010 + (Math.random() * 0.0020)
      },
      { 
        name: "TranscriptionGeneration", 
        cost: 0.0015 + (Math.random() * 0.0025)
      }
    ],
    totalCost: 0.0030 + (Math.random() * 0.0050)
  })),
  
  // Content Summarizer executions
  ...Array(45).fill(null).map((_, index) => ({
    id: `cs-${index + 1}`,
    toolName: "Content Summarizer",
    modelName: index % 2 === 0 ? "GPT-4o-mini" : "Claude 3 Haiku",
    organizationName: ["ContentHub", "MediaGroup", "InfoTech", "DataSystems"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 70)),
    llmDetails: [
      { 
        name: "TokenProcessing", 
        cost: 0.0004 + (Math.random() * 0.0006)
      },
      { 
        name: "SummarizationAlgorithm", 
        cost: 0.0003 + (Math.random() * 0.0005)
      }
    ],
    totalCost: 0.0008 + (Math.random() * 0.0015)
  })),
  
  // Knowledge Base Query executions
  ...Array(70).fill(null).map((_, index) => ({
    id: `kbq-${index + 1}`,
    toolName: "Knowledge Base Query",
    modelName: index % 3 === 0 ? "GPT-4o" : (index % 3 === 1 ? "Claude 3 Sonnet" : "GPT-4 Turbo"),
    organizationName: ["DataSystems", "KnowledgeCorp", "InfoTech", "Acme Inc"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 110)),
    llmDetails: [
      { 
        name: "TokenProcessing", 
        cost: 0.0007 + (Math.random() * 0.0013)
      },
      { 
        name: "SemanticSearch", 
        cost: 0.0010 + (Math.random() * 0.0020)
      },
      { 
        name: "ResponseGeneration", 
        cost: 0.0005 + (Math.random() * 0.0010)
      }
    ],
    totalCost: 0.0025 + (Math.random() * 0.0040)
  })),
  
  // Report Generator executions
  ...Array(35).fill(null).map((_, index) => ({
    id: `rg-${index + 1}`,
    toolName: "Report Generator",
    modelName: index % 2 === 0 ? "GPT-4 Turbo" : "Claude 3 Opus",
    organizationName: ["ReportSystems", "AnalyticsCorp", "DataInsight", "BizCorp"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 60)),
    llmDetails: [
      { 
        name: "DataProcessing", 
        cost: 0.0012 + (Math.random() * 0.0018)
      },
      { 
        name: "GraphGeneration", 
        cost: 0.0008 + (Math.random() * 0.0012)
      },
      { 
        name: "TextGeneration", 
        cost: 0.0010 + (Math.random() * 0.0015)
      }
    ],
    totalCost: 0.0035 + (Math.random() * 0.0050)
  })),
  
  // Voice Assistant executions
  ...Array(25).fill(null).map((_, index) => ({
    id: `va-${index + 1}`,
    toolName: "Voice Assistant",
    modelName: index % 2 === 0 ? "GPT-4o Voice" : "Claude 3 Opus",
    organizationName: ["VoiceTech", "SpeechSystems", "TalkTech", "AudioCorp"][index % 4],
    executionDate: subDays(new Date(), Math.floor(Math.random() * 40)),
    llmDetails: [
      { 
        name: "SpeechRecognition", 
        cost: 0.0020 + (Math.random() * 0.0030)
      },
      { 
        name: "IntentProcessing", 
        cost: 0.0010 + (Math.random() * 0.0020)
      },
      { 
        name: "ResponseSynthesis", 
        cost: 0.0015 + (Math.random() * 0.0025)
      }
    ],
    totalCost: 0.0050 + (Math.random() * 0.0080)
  }))
];

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
      
      // Calculate average LLM costs
      const llmCosts = calculateAverageLLMCosts(periodExecutions);
      
      return {
        days,
        avgCost,
        llmCosts
      };
    });
    
    return {
      moduleName,
      costPeriods: moduleCosts,
      operationDays
    };
  });
};

export const calculateAverageLLMCosts = (executions: AIExecution[]): Array<{ name: string; avgCost: number }> => {
  if (executions.length === 0) return [];
  
  // Get all unique LLM names from all executions
  const llmNames = [...new Set(executions.flatMap(exec => exec.llmDetails.map(detail => detail.name)))];
  
  // Calculate average cost for each LLM
  return llmNames.map(llmName => {
    const llmCosts = executions.map(exec => 
      exec.llmDetails.find(detail => detail.name === llmName)?.cost || 0
    );
    
    const totalLLMCost = llmCosts.reduce((sum, cost) => sum + cost, 0);
    const avgLLMCost = totalLLMCost / executions.length;
    
    return {
      name: llmName,
      avgCost: avgLLMCost
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
