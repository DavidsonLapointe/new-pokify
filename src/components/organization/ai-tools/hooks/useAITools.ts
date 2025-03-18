
import { useToolsData } from "./useToolsData";
import { useToolSelection } from "./useToolSelection";
import { useToolStyle } from "./useToolStyle";

export const useAITools = () => {
  // Use the smaller hooks
  const { 
    tools, 
    configuredTools, 
    getToolById, 
    updateSetupStatus 
  } = useToolsData();
  
  // Use "call" como ferramenta inicial, que sabemos que existe
  const {
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
  } = useToolSelection(tools.length > 0 ? tools[0].id : "call");
  
  const {
    getStatusIcon,
    getBadgeClass,
    getButtonClass
  } = useToolStyle();

  // Create wrapper functions to pass the getToolById function to the handlers
  const handleToolActionWrapper = (toolId: string) => {
    handleToolAction(toolId, getToolById);
  };

  const handleToolExecutionWrapper = (toolId: string) => {
    handleToolExecution(toolId, getToolById);
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
    currentExecuteTool,
    handleToolAction: handleToolActionWrapper,
    handleToolExecution: handleToolExecutionWrapper,
    getToolById,
    getStatusIcon,
    getBadgeClass,
    getButtonClass,
    updateSetupStatus
  };
};
