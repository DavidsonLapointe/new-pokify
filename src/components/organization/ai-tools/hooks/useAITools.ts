
import { useState } from "react";
import { Tool, ToolStatus } from "@/components/organization/modules/types";
import { toolsData } from "../data/toolsData";

export const useAITools = () => {
  const [selectedTool, setSelectedTool] = useState<string>("video");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [currentConfigTool, setCurrentConfigTool] = useState<string>("");
  const [currentExecuteTool, setCurrentExecuteTool] = useState<string>("");

  // Usar os dados das ferramentas
  const tools: Tool[] = toolsData;

  // Filtrar apenas as ferramentas com status "configured"
  const configuredTools = tools.filter(tool => tool.status === "configured");

  const getToolById = (id: string) => {
    return tools.find(tool => tool.id === id) || tools[0];
  };

  const handleToolAction = (toolId: string) => {
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

  const handleToolExecution = (toolId: string) => {
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

  // Função para retornar o ícone de status apropriado
  const getStatusIcon = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "Lock";
      case "contracted": 
        return "AlertTriangle";
      case "configured": 
        return "CheckCircle2";
      case "coming_soon":
        return "Clock";
      case "setup":
        return "RotateCw";
    }
  };

  // Função para retornar a cor de fundo do badge baseado no status
  const getBadgeClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-700";
      case "contracted": 
        return "bg-yellow-100 text-yellow-700";
      case "configured": 
        return "bg-green-100 text-green-700";
      case "coming_soon":
        return "bg-gray-100 text-gray-700";
      case "setup":
        return "bg-blue-100 text-blue-700";
    }
  };

  // Função atualizada para retornar a cor do botão baseado no status
  const getButtonClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-600 hover:bg-red-700 text-white";
      case "contracted": 
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "configured": 
        return "bg-green-600 hover:bg-green-700 text-white";
      case "coming_soon":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "setup":
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  return {
    tools,
    configuredTools,
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
    handleToolExecution,
    getToolById,
    getStatusIcon,
    getBadgeClass,
    getButtonClass
  };
};
