
import { useOrganizationFormInit } from "./hooks/use-organization-form-init";
import { useOrganizationSubmission } from "./hooks/use-organization-submission";
import { checkCnpjExists } from "./utils/cnpj-verification-utils";
import { CreateOrganizationFormData } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Main hook that combines all organization form functionality
 */
export const useOrganizationForm = (onSuccess: () => void) => {
  const { form } = useOrganizationFormInit();
  const { handleSubmit } = useOrganizationSubmission(onSuccess);

  const onSubmit = async (values: CreateOrganizationFormData) => {
    // Reset form after submission is handled
    try {
      await handleSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  /**
   * Checks if CNPJ exists in the database and is valid
   * @param cnpj CNPJ to check
   * @returns Promise with existence check result
   */
  const verifyExistingCnpj = async (cnpj: string): Promise<boolean> => {
    try {
      // Clean CNPJ before checking (remove any non-numeric characters)
      const cleanedCnpj = cnpj.replace(/[^0-9]/g, '');
      
      // Check if CNPJ exists in the database
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('cnpj', cleanedCnpj)
        .limit(1);
        
      if (error) {
        console.error("Erro ao verificar CNPJ existente:", error);
        toast.error("Erro ao verificar CNPJ. Tente novamente.");
        return false;
      }
      
      if (data && data.length > 0) {
        console.warn(`CNPJ ${cnpj} já existe para a organização "${data[0].name}"`);
        toast.error(`CNPJ ${cnpj} já cadastrado para a empresa "${data[0].name}"`);
        return true;
      }
      
      // If we reached here, the CNPJ doesn't exist in the database
      return false;
    } catch (error) {
      console.error("Erro inesperado ao verificar CNPJ:", error);
      toast.error("Erro ao verificar CNPJ. Tente novamente.");
      return false;
    }
  };

  return {
    form,
    onSubmit,
    checkCnpjExists: async (cnpj: string) => {
      // First check if it's valid
      const isValid = await checkCnpjExists(cnpj);
      
      // If valid externally, also check if it already exists in our database
      if (isValid) {
        const alreadyExists = await verifyExistingCnpj(cnpj);
        // Return false if it already exists (can't be used again)
        return !alreadyExists;
      }
      
      return isValid;
    }
  };
};
