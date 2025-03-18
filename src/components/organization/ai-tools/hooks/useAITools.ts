
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
  } = useToolSelection();
  
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
