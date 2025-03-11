
import { cleanCNPJ } from "@/utils/cnpjValidation";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if an organization with the given CNPJ already exists
 */
export const checkCnpjExists = async (cnpj: string): Promise<{exists: boolean, data?: any, error?: any}> => {
  try {
    console.log("Iniciando verificação de CNPJ:", cnpj);
    
    // First clean the CNPJ format
    const cleanedCnpj = cleanCNPJ(cnpj);
    console.log("CNPJ limpo para verificação:", cleanedCnpj);
    
    // Try direct query first
    const { data: directMatchData, error: directMatchError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('cnpj', cnpj);
      
    if (directMatchError) {
      console.error("Erro na verificação direta de CNPJ:", directMatchError);
      return { exists: false, error: directMatchError };
    }
    
    if (directMatchData && directMatchData.length > 0) {
      console.log("CNPJ encontrado por correspondência direta:", directMatchData);
      return { exists: true, data: directMatchData[0] };
    }
    
    // If no direct match, try with cleaned version
    console.log("Verificando CNPJ com formato limpo");
    const { data: allOrgs, error: allOrgsError } = await supabase
      .from('organizations')
      .select('id, name, cnpj');
    
    if (allOrgsError) {
      console.error("Erro ao buscar todas as organizações:", allOrgsError);
      return { exists: false, error: allOrgsError };
    }
    
    // Manually check if any CNPJ matches when cleaned
    const matchingOrg = allOrgs?.find(org => {
      const orgCleanCnpj = cleanCNPJ(org.cnpj);
      return orgCleanCnpj === cleanedCnpj;
    });
    
    if (matchingOrg) {
      console.log("CNPJ encontrado por correspondência com formato limpo:", matchingOrg);
      return { exists: true, data: matchingOrg };
    }
    
    console.log("CNPJ não encontrado no sistema");
    return { exists: false };
  } catch (error) {
    console.error("Erro inesperado ao verificar CNPJ:", error);
    return { exists: false, error };
  }
};

/**
 * Helper function to check if an organization exists with the given CNPJ
 * Made this exportable for potential direct use in other components
 */
export const checkExistingOrganization = async (cnpj: string) => {
  try {
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
        const orgCleanCnpj = cleanCNPJ(org.cnpj);
        return orgCleanCnpj === cleanedCnpj;
      });
      
      data = matchingOrg || null;
      console.log("Clean CNPJ match result:", !!matchingOrg, matchingOrg);
    } else {
      console.log("Exact CNPJ match found:", data);
    }
    
    // Return true if data exists (CNPJ is found), regardless of organization status
    return { exists: !!data, data, error };
  } catch (error) {
    console.error("Erro ao verificar CNPJ existente:", error);
    return { exists: false, data: null, error };
  }
};
