
import { supabase } from "@/integrations/supabase/client";

export const setupStripeProducts = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('setup-stripe-products');
    
    if (error) {
      console.error('Erro ao criar produtos:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao configurar produtos:', error);
    throw error;
  }
};
