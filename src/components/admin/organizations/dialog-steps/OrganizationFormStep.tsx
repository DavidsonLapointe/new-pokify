
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { OrganizationFormFields } from "../organization-form-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OrganizationFormStepProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  onSubmit: (values: CreateOrganizationFormData) => Promise<void>;
  onBack: () => void;
  cnpjValidated: boolean;
  selectedModules: string[];
}

export const OrganizationFormStep = ({
  form,
  onSubmit,
  onBack,
  cnpjValidated,
  selectedModules
}: OrganizationFormStepProps) => {
  const noModulesSelected = selectedModules.length === 0;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
      {noModulesSelected && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            É necessário selecionar pelo menos um módulo para a empresa.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3 w-1 bg-[#9b87f5] rounded-full"></div>
          <h3 className="text-base font-medium text-[#1A1F2C]">Dados da Empresa</h3>
        </div>
        <OrganizationFormFields form={form} cnpjValidated={cnpjValidated} />
      </div>
      
      <div className="flex justify-end space-x-4 pt-3 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button 
          type="submit" 
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          disabled={noModulesSelected}
        >
          Criar Empresa
        </Button>
      </div>
    </form>
  );
};
