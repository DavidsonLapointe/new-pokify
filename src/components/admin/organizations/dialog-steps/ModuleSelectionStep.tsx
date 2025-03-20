
import React from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { usePlans } from "../hooks/use-plans";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { plans, isLoading } = usePlans();

  const handleAddModule = (moduleId: string) => {
    if (!selectedModules.includes(moduleId)) {
      onModuleChange([...selectedModules, moduleId]);
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    onModuleChange(selectedModules.filter(id => id !== moduleId));
  };

  return (
    <div className="space-y-5 py-4">
      <div className="space-y-3">
        <div>
          <FormLabel className="text-base font-medium">
            Módulos disponíveis <span className="font-normal text-gray-500">(selecione os módulos que deseja associar à empresa)</span>
          </FormLabel>
          <div className="mt-2 p-3 border rounded-md bg-slate-50">
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedModules.length > 0 ? (
                selectedModules.map((moduleId) => {
                  const module = plans.find(p => p.id.toString() === moduleId);
                  return module ? (
                    <Badge 
                      key={moduleId} 
                      variant="secondary"
                      className="px-2.5 py-1 flex items-center bg-[#9b87f5] text-white"
                    >
                      {module.name}
                      <button 
                        type="button"
                        className="ml-1.5 text-white hover:text-gray-200 focus:outline-none"
                        onClick={() => handleRemoveModule(moduleId)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ) : null;
                })
              ) : (
                <div className="text-sm text-gray-500">
                  Nenhum módulo selecionado
                </div>
              )}
            </div>
            
            <Select
              disabled={isLoading}
              onValueChange={(value) => handleAddModule(value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione um módulo" />
              </SelectTrigger>
              <SelectContent>
                {plans
                  .filter(plan => plan.active)
                  .map(plan => (
                    <SelectItem
                      key={plan.id}
                      value={plan.id.toString()}
                      disabled={selectedModules.includes(plan.id.toString())}
                    >
                      <div className="flex items-center">
                        <span>{plan.name}</span>
                        {selectedModules.includes(plan.id.toString()) && (
                          <CheckIcon className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
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
        >
          Cadastrar Empresa
        </Button>
      </div>
    </div>
  );
};
