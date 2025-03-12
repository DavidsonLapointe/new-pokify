
import { supabase } from "@/integrations/supabase/client";
import { cleanCNPJ } from "@/utils/cnpjValidation";

/**
 * Checks if an organization with the given CNPJ already exists
 * This is now completely simplified to always allow organization creation
 */
export const checkExistingOrganization = async (cnpj: string) => {
  // We're allowing duplicate CNPJs, so we always return success
  return { 
    exists: false, 
    data: null, 
    error: null 
  };
};
