
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { OrganizationFormFields } from "../organization-form-fields";

interface OrganizationFormStepProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  onSubmit: (values: CreateOrganizationFormData) => Promise<void>;
  onBack: () => void;
  cnpjValidated: boolean;
}

export const OrganizationFormStep = ({
  form,
  onSubmit,
  onBack,
  cnpjValidated
}: OrganizationFormStepProps) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
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
        <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
          Criar Empresa
        </Button>
      </div>
    </form>
  );
};
