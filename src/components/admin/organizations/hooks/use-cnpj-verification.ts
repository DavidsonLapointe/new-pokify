
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
      // Consultar CNPJ formatado sem caracteres especiais
      const cleanedCnpj = cnpj.replace(/[^\d]/g, '');
      
      console.log("Verificando CNPJ no banco:", cleanedCnpj);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('cnpj', cleanedCnpj)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao verificar CNPJ existente:", error);
        throw error;
      }
      
      return !!data; // Retorna true se organização com este CNPJ existir
    } catch (error) {
      console.error("Erro ao verificar CNPJ existente:", error);
      return false;
    }
  };

  const handleCnpjNext = async () => {
    // Obter valor do CNPJ
    const cnpj = form.getValues("cnpj");
    
    // Formatar CNPJ e atualizar no formulário
    const formattedCnpj = formatCNPJ(cnpj);
    form.setValue("cnpj", formattedCnpj);
    
    // Validar formato do CNPJ
    if (!validateCNPJ(cnpj)) {
      form.setError("cnpj", { 
        type: "manual", 
        message: "CNPJ inválido. Verifique o número informado." 
      });
      return;
    }
    
    // Verificar se CNPJ já existe
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
      
      // Avançar para o próximo passo
      setCnpjValidated(true);
      onCnpjVerified();
      toast.success("O CNPJ é válido. Continue o cadastro.");
      
      // Limpar erros existentes no campo de CNPJ
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
