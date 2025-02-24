
import { supabase } from "@/integrations/supabase/client";
import type { Plan } from "@/components/admin/plans/plan-form-schema";

interface UpdateStripeProductParams {
  stripeProductId: string;
  stripePriceId: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  credits?: number;
}

export const updateStripeProduct = async (params: UpdateStripeProductParams) => {
  console.log('Atualizando produto no Stripe:', params);
  
  try {
    const { data, error } = await supabase.functions.invoke('update-stripe-product', {
      body: params
    });
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
    
    console.log('Produto atualizado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};
