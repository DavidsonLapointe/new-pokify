
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
import { ModuleSelector } from "@/components/admin/prompts/form/ModuleSelector";

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
  const [selectedModule, setSelectedModule] = useState<string>("");

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
      setSelectedModule("");
    }
  }, [open, form, setCnpjValidated]);

  // Handle module selection
  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    // You can also update the form data if needed
    // form.setValue('selectedModule', value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-semibold text-[#1A1F2C]">Nova Empresa</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {step === 1 
              ? "Informe o CNPJ da empresa para verificação."
              : "Preencha os dados da empresa e do administrador inicial."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {step === 1 ? (
            <CnpjVerificationStep 
              form={form} 
              isCheckingCnpj={isCheckingCnpj} 
              onNext={handleCnpjNext} 
              onCancel={() => onOpenChange(false)} 
            />
          ) : (
            <>
              {/* Module selection before organization form */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Módulo Preferencial</h3>
                <ModuleSelector 
                  value={selectedModule}
                  onChange={handleModuleChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Selecione o módulo de interesse principal para esta empresa
                </p>
              </div>
              
              {/* Original organization form */}
              <OrganizationFormStep 
                form={form} 
                onSubmit={onSubmit} 
                onBack={() => setStep(1)} 
                cnpjValidated={cnpjValidated} 
              />
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
