
import { useState } from "react";
import { AIToolsHeader } from "@/components/organization/ai-tools/AIToolsHeader";
import { AIToolCards } from "@/components/organization/ai-tools/AIToolCards";
import { AIToolDetails } from "@/components/organization/ai-tools/AIToolDetails";
import { AIToolDialogs } from "@/components/organization/ai-tools/AIToolDialogs";
import { useAITools } from "@/components/organization/ai-tools/hooks/useAITools";

const AIToolsPage = () => {
  const {
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
    handleToolAction,
    handleToolExecution,
    getToolById
  } = useAITools();

  return (
    <div className="space-y-8">
      <AIToolsHeader />
      
      <AIToolCards 
        configuredTools={configuredTools}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />

      {configuredTools.map((tool) => (
        selectedTool === tool.id && (
          <AIToolDetails 
            key={`details-${tool.id}`}
            tool={tool}
            onExecute={() => handleToolExecution(tool.id)}
          />
        )
      ))}

      <AIToolDialogs
        isConfigModalOpen={isConfigModalOpen}
        setIsConfigModalOpen={setIsConfigModalOpen}
        isExecuteModalOpen={isExecuteModalOpen}
        setIsExecuteModalOpen={setIsExecuteModalOpen}
        currentConfigTool={currentConfigTool}
        currentExecuteTool={currentExecuteTool}
        getToolById={getToolById}
      />
    </div>
  );
};

export default AIToolsPage;
