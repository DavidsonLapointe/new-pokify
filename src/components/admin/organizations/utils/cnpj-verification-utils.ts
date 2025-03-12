
import { supabase } from "@/integrations/supabase/client";
import { cleanCNPJ } from "@/utils/cnpjValidation";

/**
 * Checks if an organization with the given CNPJ already exists
 * This is now simplified to always allow CNPJ creation
 */
export const checkExistingOrganization = async (cnpj: string) => {
  try {
    // We're now allowing duplicate CNPJs, so we'll always return false
    return { 
      exists: false, 
      data: null, 
      error: null 
    };
  } catch (error) {
    console.error("Error checking existing organization:", error);
    return { exists: false, data: null, error };
  }
};
