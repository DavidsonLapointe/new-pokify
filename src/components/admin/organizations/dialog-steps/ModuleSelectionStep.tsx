
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { ModuleSelector } from "@/components/admin/modules/ModuleSelector";

interface ModuleSelectionStepProps {
  selectedModules: string[];
  onModuleChange: (moduleIds: string[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  form: UseFormReturn<CreateOrganizationFormData>;
}

export const ModuleSelectionStep = ({
  selectedModules,
  onModuleChange,
  onBack,
  onSubmit,
  form
}: ModuleSelectionStepProps) => {
  const noModulesSelected = selectedModules.length === 0;
  
  const handleSubmit = () => {
    if (noModulesSelected) return;
    onSubmit();
  };

  return (
    <div className="space-y-4 py-4">
      <h3 className="text-sm font-medium mb-2">Módulos para a Empresa</h3>
      
      {noModulesSelected && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            É necessário selecionar pelo menos um módulo para a empresa.
          </AlertDescription>
        </Alert>
      )}
      
      <ModuleSelector 
        selectedModules={selectedModules}
        onModuleChange={onModuleChange}
      />
      
      <div className="flex justify-end space-x-4 pt-3 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          disabled={noModulesSelected}
        >
          Criar Empresa
        </Button>
      </div>
    </div>
  );
};
