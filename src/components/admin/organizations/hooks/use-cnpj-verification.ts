
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
    
    // Check if CNPJ already exists in the database
    setIsCheckingCnpj(true);
    try {
      console.log("Verifying CNPJ:", formattedCnpj);
      const { exists, data, error } = await checkExistingOrganization(formattedCnpj);
      console.log("Verification result:", { exists, data, error });
      
      if (error) {
        console.error("Error checking CNPJ:", error);
        toast({
          title: "Erro ao verificar CNPJ",
          description: "Ocorreu um erro ao verificar o CNPJ. Tente novamente.",
          variant: "destructive",
        });
        setIsCheckingCnpj(false);
        return;
      }
      
      if (exists && data) {
        const companyName = data.name || "Empresa existente";
        form.setError("cnpj", { 
          type: "manual", 
          message: `Este CNPJ já está cadastrado no sistema para a empresa "${companyName}".` 
        });
        setIsCheckingCnpj(false);
        toast({
          title: "CNPJ já cadastrado",
          description: `Este CNPJ já está cadastrado no sistema para a empresa "${companyName}".`,
          variant: "destructive",
        });
        return;
      }
      
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
