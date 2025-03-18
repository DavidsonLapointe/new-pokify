
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useOrganizationForm } from "./use-organization-form";
import { CnpjVerificationStep } from "./dialog-steps/CnpjVerificationStep";
import { OrganizationFormStep } from "./dialog-steps/OrganizationFormStep";
import { useCnpjVerification } from "./hooks/use-cnpj-verification";
import { ModuleSelectionStep } from "./dialog-steps/ModuleSelectionStep";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateOrganizationDialog = ({
  open,
  onOpenChange,
  onSuccess = () => {}
}: CreateOrganizationDialogProps) => {
  const { form, onSubmit, checkCnpjExists } = useOrganizationForm(() => {
    onOpenChange(false);
    onSuccess();
  });

  const [step, setStep] = useState(1);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Handle CNPJ verification with the custom hook
  const { 
    isCheckingCnpj, 
    cnpjValidated, 
    setCnpjValidated, 
    handleCnpjNext 
  } = useCnpjVerification({
    form,
    onCnpjVerified: () => setStep(2)
  });

  // Reset form and step when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setStep(1);
      setCnpjValidated(false);
      setSelectedModules([]);
    }
  }, [open, form, setCnpjValidated]);

  // Handle module selection changes
  const handleModuleChange = (moduleIds: string[]) => {
    setSelectedModules(moduleIds);
  };

  // Handle form submission with selected modules
  const handleSubmit = async (values: any) => {
    // Add the selected modules to the form values
    const valuesWithModules = {
      ...values,
      modules: selectedModules
    };
    
    await onSubmit(valuesWithModules);
  };

  // Move to module selection step
  const handleNextToModules = async (values: any) => {
    // Save form values for the next step
    Object.entries(values).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });
    setStep(3);
  };

  // Go back to organization details step
  const handleBackToDetails = () => {
    setStep(2);
  };

  let dialogTitle = "Nova Empresa";
  let dialogDescription = "Informe o CNPJ da empresa para verificação.";

  if (step === 2) {
    dialogDescription = "Preencha os dados da empresa e do administrador.";
  } else if (step === 3) {
    dialogTitle = "Selecionar Módulos";
    dialogDescription = "Selecione pelo menos um módulo para associar à empresa.";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-semibold text-[#1A1F2C]">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {step === 1 && (
            <CnpjVerificationStep 
              form={form} 
              isCheckingCnpj={isCheckingCnpj} 
              onNext={handleCnpjNext} 
              onCancel={() => onOpenChange(false)} 
            />
          )}
          
          {step === 2 && (
            <OrganizationFormStep 
              form={form} 
              onSubmit={handleNextToModules} 
              onBack={() => setStep(1)} 
              cnpjValidated={cnpjValidated} 
            />
          )}
          
          {step === 3 && (
            <ModuleSelectionStep
              selectedModules={selectedModules}
              onModuleChange={handleModuleChange}
              onBack={handleBackToDetails}
              onSubmit={handleSubmit}
              form={form}
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
