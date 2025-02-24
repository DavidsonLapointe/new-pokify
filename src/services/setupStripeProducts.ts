
import { supabase } from "@/integrations/supabase/client";

export const setupStripeProducts = async () => {
  console.log('Iniciando chamada para criar produtos...');
  
  try {
    const { data, error } = await supabase.functions.invoke('setup-stripe-products');
    
    if (error) {
      console.error('Erro ao criar produtos:', error);
      throw error;
    }
    
    console.log('Resposta da função:', data);
    return data;
  } catch (error) {
    console.error('Erro ao configurar produtos:', error);
    throw error;
  }
};
