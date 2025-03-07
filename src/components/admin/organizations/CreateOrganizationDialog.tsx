
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
    }
  }, [open, form, setCnpjValidated]);

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
            <OrganizationFormStep 
              form={form} 
              onSubmit={onSubmit} 
              onBack={() => setStep(1)} 
              cnpjValidated={cnpjValidated} 
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
