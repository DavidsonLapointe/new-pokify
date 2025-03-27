import React from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { useModules } from "../hooks/use-modules";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, X, MessageSquare, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModuleSelectionStepProps {
  selectedModules: string[];
  onModuleChange: (moduleIds: string[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  form: any;
}

export const ModuleSelectionStep: React.FC<ModuleSelectionStepProps> = ({
  selectedModules,
  onModuleChange,
  onBack,
  onSubmit,
  form
}) => {
  const { modules, isLoading } = useModules();

  const handleToggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      onModuleChange(selectedModules.filter(id => id !== moduleId));
    } else {
      onModuleChange([...selectedModules, moduleId]);
    }
  };

  // Function to determine icon component based on module name or icon
  const getModuleIcon = (module: any) => {
    if (module.name.toLowerCase().includes('transcri')) {
      return <Video className="h-5 w-5 text-indigo-300" />;
    } else if (module.name.toLowerCase().includes('finance')) {
      return <MessageSquare className="h-5 w-5 text-indigo-300" />;
    } else {
      return <MessageSquare className="h-5 w-5 text-indigo-300" />;
    }
  };

  return (
    <div className="space-y-5 py-4">
      <div className="space-y-3">
        <FormLabel className="text-base font-medium">
          Módulos disponíveis <span className="font-normal text-gray-500">(selecione os módulos desejados)</span>
        </FormLabel>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Carregando módulos...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                  selectedModules.includes(module.id.toString())
                    ? "border-2 border-indigo-300 bg-indigo-50/30"
                    : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/20"
                }`}
                onClick={() => handleToggleModule(module.id.toString())}
              >
                <div className="absolute right-3 top-3">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Ativo
                  </Badge>
                </div>
                
                <div className="flex items-start mb-2">
                  <div className="h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                    {getModuleIcon(module)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{module.name}</h3>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="text-indigo-500 font-medium">
                        R$ {module.value.toFixed(2)}
                      </span>
                      <span className="text-gray-500">(setup)</span>
                    </div>
                  </div>
                </div>
                
                {module.credit_per_use && (
                  <div className="text-sm text-amber-600 font-medium">
                    ⚡ {module.credit_per_use} créditos por execução
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-1">
                  {module.short_description || "Sem descrição disponível"}
                </p>
                
                <div className="mt-2 text-xs text-indigo-500">
                  Ver Detalhes ↓
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={selectedModules.length === 0}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          Cadastrar Empresa
        </Button>
      </div>
    </div>
  );
};
