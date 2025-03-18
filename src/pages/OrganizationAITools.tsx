
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AIToolsHeader } from "@/components/organization/ai-tools/AIToolsHeader";
import { AIToolCards } from "@/components/organization/ai-tools/AIToolCards";
import { AIToolDetails } from "@/components/organization/ai-tools/AIToolDetails";
import { AIToolDialogs } from "@/components/organization/ai-tools/AIToolDialogs";
import { useAITools } from "@/components/organization/ai-tools/hooks/useAITools";
import { toast } from "sonner";

const OrganizationAITools = () => {
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
    getToolById,
    updateSetupStatus
  } = useAITools();

  // Ao carregar a página, podemos verificar se há atualizações nos status das ferramentas
  useEffect(() => {
    console.log("Verificando atualizações de status das ferramentas...");
    
    // Em um ambiente real, isso seria uma chamada de API para verificar os status
    const checkForUpdates = async () => {
      try {
        // Simulação de uma ferramenta que teve seu setup concluído recentemente
        const videoTool = tools.find(tool => tool.id === "video");
        if (videoTool && videoTool.status === "setup") {
          // Simulando uma atualização após 3 segundos
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          updateSetupStatus("video", "completed");
          toast.success("O módulo de Prospecção com Vídeo foi configurado e agora está disponível para uso!");
        }
      } catch (error) {
        console.error("Erro ao verificar atualizações:", error);
      }
    };
    
    // Comentei esta linha para evitar que a simulação aconteça automaticamente
    // checkForUpdates();
  }, [tools, updateSetupStatus]);

  // Determinar qual ferramenta mostrar nos detalhes
  const selectedToolData = getToolById(selectedTool);

  return (
    <div className="space-y-6 px-4 py-6">
      <AIToolsHeader />
      
      {/* Cards ferramentas configuradas */}
      <AIToolCards 
        configuredTools={configuredTools} 
        selectedTool={selectedTool} 
        setSelectedTool={setSelectedTool} 
      />
      
      {/* Detalhes da ferramenta selecionada */}
      <AIToolDetails 
        tool={selectedToolData} 
        onExecute={() => handleToolExecution(selectedToolData.id)} 
      />
      
      {/* Modais */}
      <AIToolDialogs 
        isConfigModalOpen={isConfigModalOpen}
        setIsConfigModalOpen={setIsConfigModalOpen}
        isExecuteModalOpen={isExecuteModalOpen}
        setIsExecuteModalOpen={setIsExecuteModalOpen}
        currentConfigTool={getToolById(currentConfigTool)}
        currentExecuteTool={getToolById(currentExecuteTool)}
      />

      {/* Botão para simulação (apenas para teste) */}
      <Card className="p-4 bg-gray-50 border-dashed border-gray-300">
        <h3 className="text-md font-medium mb-2">Simulação de Ambiente Admin</h3>
        <p className="text-sm text-gray-600 mb-3">
          Esta seção é apenas para simular a mudança de status pelo administrador.
        </p>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md text-sm"
            onClick={() => {
              updateSetupStatus("video", "pending");
              toast.info("Simulação: O módulo de Prospecção com Vídeo foi definido como 'Pendente'");
            }}
          >
            Definir como Pendente
          </button>
          <button 
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm"
            onClick={() => {
              updateSetupStatus("video", "in_progress");
              toast.info("Simulação: O módulo de Prospecção com Vídeo foi definido como 'Em Andamento'");
            }}
          >
            Definir como Em Andamento
          </button>
          <button 
            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm"
            onClick={() => {
              updateSetupStatus("video", "completed");
              toast.success("Simulação: O módulo de Prospecção com Vídeo foi definido como 'Concluído'!");
            }}
          >
            Definir como Concluído
          </button>
        </div>
      </Card>
    </div>
  );
};

export default OrganizationAITools;
