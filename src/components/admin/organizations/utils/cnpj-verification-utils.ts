
import { cleanCNPJ } from "@/utils/cnpjValidation";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if an organization with the given CNPJ already exists
 */
export const checkCnpjExists = async (cnpj: string): Promise<{exists: boolean, data?: any, error?: any}> => {
  try {
    console.log("Iniciando verificação de CNPJ:", cnpj);
    
    const { exists, data, error } = await checkExistingOrganization(cnpj);
    
    if (error) {
      console.error("Erro ao verificar CNPJ existente:", error);
      throw error;
    }
    
    console.log("Resultado da verificação:", exists ? "CNPJ já existe" : "CNPJ disponível");
    
    // Return whether CNPJ exists or not along with data
    return { exists, data };
  } catch (error) {
    console.error("Erro ao verificar CNPJ:", error);
    throw error;
  }
};

/**
 * Helper function to check if an organization exists with the given CNPJ
 * Made this exportable for potential direct use in other components
 */
export const checkExistingOrganization = async (cnpj: string) => {
  // Clean the CNPJ format to ensure consistent comparison - remove all non-digit characters
  const cleanedCnpj = cleanCNPJ(cnpj);
  
  console.log("Checking for existing CNPJ:", cleanedCnpj, "Original format:", cnpj);
  
  // First try exact match with the formatted version (with punctuation)
  let { data, error } = await supabase
    .from('organizations')
    .select('id, cnpj, name')
    .eq('cnpj', cnpj)
    .maybeSingle();
  
  if (!data) {
    // If no exact match, try with the cleaned version (just digits)
    console.log("No exact match found, trying with cleaned CNPJ format");
    
    // Check for CNPJs that would match when cleaned (removing punctuation)
    const { data: allOrgs, error: fetchError } = await supabase
      .from('organizations')
      .select('id, cnpj, name');
      
    if (fetchError) {
      console.error("Error fetching organizations:", fetchError);
      return { exists: false, data: null, error: fetchError };
    }
    
    // Manually find if any existing CNPJ matches when non-digits are removed
    const matchingOrg = allOrgs?.find(org => {
      const orgCleanCnpj = org.cnpj.replace(/[^\d]/g, '');
      return orgCleanCnpj === cleanedCnpj;
    });
    
    data = matchingOrg || null;
    console.log("Clean CNPJ match result:", !!matchingOrg, matchingOrg);
  } else {
    console.log("Exact CNPJ match found:", data);
  }
  
  // Return true if data exists (CNPJ is found), regardless of organization status
  return { exists: !!data, data, error };
};
