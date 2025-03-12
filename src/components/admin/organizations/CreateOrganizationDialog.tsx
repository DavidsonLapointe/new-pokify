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
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const { form, onSubmit } = useOrganizationForm(() => {
    setIsSubmitting(false);
    onOpenChange(false);
    onSuccess();
    toast.success("Empresa criada com sucesso!");
  });

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
      setIsSubmitting(false);
    }
  }, [open, form, setCnpjValidated]);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      console.log("Iniciando submissão do formulário:", values);
      await onSubmit(values);
    } catch (error) {
      console.error("Erro na submissão do formulário:", error);
      setIsSubmitting(false);
      toast.error("Erro ao criar empresa. Por favor, tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newState) => {
      if (isSubmitting && !newState) {
        toast.error("Por favor, aguarde enquanto processamos sua solicitação.");
        return;
      }
      onOpenChange(newState);
    }}>
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
              onSubmit={handleSubmit} 
              onBack={() => setStep(1)} 
              cnpjValidated={cnpjValidated}
              isSubmitting={isSubmitting}
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
