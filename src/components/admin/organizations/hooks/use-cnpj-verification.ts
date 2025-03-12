
import { useState } from "react";
import { validateCNPJ, formatCNPJ } from "@/utils/cnpjValidation";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const checkExistingCnpj = async (cnpj: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('cnpj', cnpj)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao verificar CNPJ existente:", error);
        return false; // Assume no duplicate in case of error
      }
      
      return !!data; // Return true if organization with this CNPJ exists
    } catch (error) {
      console.error("Erro ao verificar CNPJ existente:", error);
      return false;
    }
  };

  const handleCnpjNext = async () => {
    // Get the CNPJ value
    const cnpj = form.getValues("cnpj");
    
    // Format CNPJ as user types and update the form
    const formattedCnpj = formatCNPJ(cnpj);
    form.setValue("cnpj", formattedCnpj);
    
    // Only validate format, nothing more
    if (!validateCNPJ(cnpj)) {
      form.setError("cnpj", { 
        type: "manual", 
        message: "CNPJ inválido. Verifique o número informado." 
      });
      return;
    }
    
    // Check if CNPJ already exists
    setIsCheckingCnpj(true);
    try {
      const exists = await checkExistingCnpj(formattedCnpj);
      
      if (exists) {
        form.setError("cnpj", { 
          type: "manual", 
          message: "Este CNPJ já está cadastrado no sistema." 
        });
        toast.error("Este CNPJ já está cadastrado no sistema.");
        return;
      }
      
      console.log("Formato do CNPJ validado:", formattedCnpj);
      
      // Proceed to the next step
      setCnpjValidated(true);
      onCnpjVerified();
      toast("O CNPJ é válido. Continue o cadastro.");
      
      // Clear any existing errors on the CNPJ field
      form.clearErrors("cnpj");
    } catch (error) {
      console.error("Erro ao validar CNPJ:", error);
      toast.error("Ocorreu um erro ao validar o CNPJ. Tente novamente.");
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
