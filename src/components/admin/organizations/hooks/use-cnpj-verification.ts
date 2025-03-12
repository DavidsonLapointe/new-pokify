
import { useState } from "react";
import { validateCNPJ, formatCNPJ } from "@/utils/cnpjValidation";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { useToast } from "@/hooks/use-toast";
import { checkExistingOrganization } from "../utils/cnpj-verification-utils";

interface UseCnpjVerificationProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  onCnpjVerified: () => void;
}

export const useCnpjVerification = ({ 
  form, 
  onCnpjVerified 
}: UseCnpjVerificationProps) => {
  const [isCheckingCnpj, setIsCheckingCnpj] = useState(false);
  const [cnpjValidated, setCnpjValidated] = useState(false);
  const { toast } = useToast();

  const handleCnpjNext = async () => {
    // Get the CNPJ value
    const cnpj = form.getValues("cnpj");
    
    // Format CNPJ as user types and update the form
    const formattedCnpj = formatCNPJ(cnpj);
    form.setValue("cnpj", formattedCnpj);
    
    // Validate format
    if (!validateCNPJ(cnpj)) {
      form.setError("cnpj", { 
        type: "manual", 
        message: "CNPJ inválido. Verifique o número informado." 
      });
      return;
    }
    
    // We'll skip checking if the CNPJ exists in the database
    setIsCheckingCnpj(true);
    try {
      console.log("Verificando formato do CNPJ:", formattedCnpj);
      
      // If everything is valid, proceed to the next step
      setCnpjValidated(true);
      onCnpjVerified();
      toast({
        title: "CNPJ Validado",
        description: "O CNPJ é válido. Continue o cadastro.",
      });
      
      // Clear any existing errors on the CNPJ field
      form.clearErrors("cnpj");
    } catch (error) {
      console.error("Error verifying CNPJ:", error);
      toast({
        title: "Erro ao verificar CNPJ",
        description: "Ocorreu um erro ao verificar o CNPJ. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingCnpj(false);
    }
  };

  return {
    isCheckingCnpj,
    cnpjValidated,
    setCnpjValidated,
    handleCnpjNext
  };
};
