
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tool } from "@/components/organization/modules/types";

interface AIToolDialogsProps {
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  isExecuteModalOpen: boolean;
  setIsExecuteModalOpen: (open: boolean) => void;
  currentConfigTool: string;
  currentExecuteTool: string;
  getToolById: (id: string) => Tool;
}

export const AIToolDialogs: React.FC<AIToolDialogsProps> = ({
  isConfigModalOpen,
  setIsConfigModalOpen,
  isExecuteModalOpen,
  setIsExecuteModalOpen,
  currentConfigTool,
  currentExecuteTool,
  getToolById
}) => {
  return (
    <>
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentConfigTool && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const tool = getToolById(currentConfigTool);
                    const ToolIcon = tool.icon;
                    return <ToolIcon className="text-[#9b87f5]" size={18} />;
                  })()}
                  Configurar {getToolById(currentConfigTool).title}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600 mb-5">
              Aqui você pode configurar as opções específicas desta ferramenta de IA para personalizar seu funcionamento de acordo com suas necessidades.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="cancel" onClick={() => setIsConfigModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsConfigModalOpen(false)}>
                Salvar Configurações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExecuteModalOpen} onOpenChange={setIsExecuteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentExecuteTool && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const tool = getToolById(currentExecuteTool);
                    const ToolIcon = tool.executeIcon || tool.icon;
                    return <ToolIcon className="text-[#9b87f5]" size={18} />;
                  })()}
                  {getToolById(currentExecuteTool).executeLabel || "Executar"}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600 mb-5">
              Selecione um lead para executar esta ferramenta de IA. A ferramenta será aplicada usando os dados do lead selecionado.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="cancel" onClick={() => setIsExecuteModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsExecuteModalOpen(false)}>
                Executar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
