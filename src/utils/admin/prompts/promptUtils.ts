
import { Prompt } from "@/types/prompt";
import { iconMap } from "@/components/admin/modules/module-constants";

// Define a type for module grouping
export type ModuleGroup = {
  name: string;
  icon: React.ElementType;
  prompts: Prompt[];
};

export type AvailableModule = {
  id: string;
  name: string;
  icon: keyof typeof iconMap;
};

// Define the available modules
export const availableModules: AvailableModule[] = [
  { id: "geral", name: "Geral", icon: "Blocks" },
  { id: "chat", name: "Chat AI Assistente", icon: "MessageCircle" },
  { id: "video", name: "Criador de Vídeos", icon: "Video" },
  { id: "audio", name: "Transcrição de Áudio", icon: "Headphones" },
  { id: "crm", name: "CRM Inteligente", icon: "UserRound" },
  { id: "analise", name: "Análise de Tendências", icon: "LineChart" }
];

// Group prompts by module and type
export const groupPromptsByModule = (prompts: Prompt[], type: string, modules: AvailableModule[]): ModuleGroup[] => {
  const filteredPrompts = prompts.filter(prompt => prompt.type === type);
  
  return modules.map(module => ({
    name: module.name,
    icon: iconMap[module.icon],
    prompts: filteredPrompts.filter(prompt => prompt.module === module.id)
  })).filter(group => group.prompts.length > 0);
};
