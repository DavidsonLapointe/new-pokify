
import { useState } from "react";
import { Tool } from "@/components/organization/modules/types";

export const useToolSelection = (initialTool: string = "video") => {
  const [selectedTool, setSelectedTool] = useState<string>(initialTool);
  
  // For handling tool action (configure)
  const [currentConfigTool, setCurrentConfigTool] = useState<string>("");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  // For handling tool execution
  const [currentExecuteTool, setCurrentExecuteTool] = useState<string>("");
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);

  const handleToolAction = (toolId: string, getToolById: (id: string) => Tool) => {
    const tool = getToolById(toolId);
    
    if (tool.status === "not_contracted") {
      // Lógica para contratação
      console.log("Iniciando contratação da ferramenta:", toolId);
    } else if (tool.status !== "coming_soon" && tool.status !== "setup") {
      // Abrir modal de configuração apenas se não for "Em breve" ou "Em Setup"
      setCurrentConfigTool(toolId);
      setIsConfigModalOpen(true);
    }
  };

  const handleToolExecution = (toolId: string, getToolById: (id: string) => Tool) => {
    const tool = getToolById(toolId);
    
    if (tool.status === "not_contracted" || tool.status === "coming_soon" || tool.status === "setup") {
      // Não permitir execução de ferramentas não contratadas, em breve ou em setup
      return;
    }
    
    // Abrir modal de execução
    setCurrentExecuteTool(toolId);
    setIsExecuteModalOpen(true);
    
    console.log("Executando ferramenta:", toolId);
  };

  return {
    selectedTool,
    setSelectedTool,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isExecuteModalOpen,
    setIsExecuteModalOpen,
    currentConfigTool,
    setCurrentConfigTool,
    currentExecuteTool,
    setCurrentExecuteTool,
    handleToolAction,
    handleToolExecution
  };
};
