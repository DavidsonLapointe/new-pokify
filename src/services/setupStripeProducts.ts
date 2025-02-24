
import { supabase } from "@/integrations/supabase/client";

export const setupStripeProducts = async (type: 'credits' | 'plans' = 'credits') => {
  console.log('Iniciando chamada para criar produtos...', { type });
  
  try {
    const { data, error } = await supabase.functions.invoke('setup-stripe-products', {
      body: { type }
    });
    
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
