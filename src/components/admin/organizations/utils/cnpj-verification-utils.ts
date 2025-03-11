
import { supabase } from "@/integrations/supabase/client";
import { cleanCNPJ } from "@/utils/cnpjValidation";

/**
 * Checks if an organization with the given CNPJ already exists
 * This is a simplified version that does only one thing and does it well
 */
export const checkExistingOrganization = async (cnpj: string) => {
  try {
    // Clean the CNPJ format to ensure consistent comparison
    const cleanedCnpj = cleanCNPJ(cnpj);
    
    console.log("Checking for existing CNPJ:", cleanedCnpj, "Original format:", cnpj);
    
    // Get all organizations with this CNPJ
    const { data, error } = await supabase
      .from('organizations')
      .select('id, cnpj, name')
      .eq('cnpj', cnpj)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching organizations:", error);
      return { exists: false, data: null, error };
    }
    
    return { 
      exists: !!data, 
      data, 
      error: null 
    };
  } catch (error) {
    console.error("Error checking existing organization:", error);
    return { exists: false, data: null, error };
  }
};
