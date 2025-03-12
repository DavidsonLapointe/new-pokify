
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Checks if a CNPJ exists in the Receita Federal database
 * This is a mock implementation - in a real scenario, this would call
 * an API to verify the CNPJ in the Receita Federal database
 */
export const checkCnpjExists = async (cnpj: string): Promise<boolean> => {
  try {
    // Clean CNPJ before checking (remove any non-numeric characters)
    const cleanedCnpj = cnpj.replace(/[^0-9]/g, '');
    
    // In a real application, we would call an external API to verify the CNPJ
    // This is just a mock that checks that the CNPJ is valid format and length
    if (cleanedCnpj.length !== 14) {
      toast.error("CNPJ inválido. O CNPJ deve ter 14 dígitos.");
      return false;
    }
    
    // Check if the CNPJ already exists in our database
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
      return false;
    }
    
    // Mock API request
    console.log(`Verificando CNPJ ${cleanedCnpj} (simulado)`);
    
    // Simulate a delay for API call 
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demonstration purposes, consider the CNPJ valid if it doesn't exist in our database
    return true;
  } catch (error) {
    console.error("Erro ao verificar CNPJ:", error);
    toast.error("Erro ao verificar CNPJ. Tente novamente.");
    return false;
  }
};

/**
 * Checks if a CNPJ already exists in our database
 */
export const checkCnpjExistsInDatabase = async (cnpj: string): Promise<boolean> => {
  try {
    // Clean CNPJ before checking
    const cleanedCnpj = cnpj.replace(/[^0-9]/g, '');
    
    // Check if CNPJ exists in our database
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('cnpj', cleanedCnpj)
      .limit(1);
      
    if (error) {
      console.error("Erro ao verificar CNPJ no banco de dados:", error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Erro inesperado ao verificar CNPJ no banco de dados:", error);
    return false;
  }
};
