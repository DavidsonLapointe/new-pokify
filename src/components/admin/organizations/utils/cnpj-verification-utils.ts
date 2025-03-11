
import { cleanCNPJ } from "@/utils/cnpjValidation";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if an organization with the given CNPJ already exists
 * This is a simplified version that does only one thing and does it well
 */
export const checkExistingOrganization = async (cnpj: string) => {
  try {
    // Clean the CNPJ format to ensure consistent comparison
    const cleanedCnpj = cleanCNPJ(cnpj);
    
    console.log("Checking for existing CNPJ:", cleanedCnpj, "Original format:", cnpj);
    
    // Get all organizations
    const { data: allOrgs, error: fetchError } = await supabase
      .from('organizations')
      .select('id, cnpj, name');
      
    if (fetchError) {
      console.error("Error fetching organizations:", fetchError);
      return { exists: false, data: null, error: fetchError };
    }
    
    // Check both original format and cleaned format
    const matchingOrg = allOrgs?.find(org => {
      return org.cnpj === cnpj || cleanCNPJ(org.cnpj) === cleanedCnpj;
    });
    
    return { 
      exists: !!matchingOrg, 
      data: matchingOrg || null, 
      error: null 
    };
  } catch (error) {
    console.error("Error checking existing organization:", error);
    return { exists: false, data: null, error };
  }
};
