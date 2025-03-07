
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
      console.error('Erro ao invocar função do Stripe:', error);
      throw error;
    }
    
    if (!data || !data.success) {
      console.error('Erro retornado pelo Stripe:', data?.error || 'Resposta inválida');
      throw new Error(data?.error || 'Erro ao processar a solicitação no Stripe');
    }
    
    console.log('Produto atualizado com sucesso no Stripe:', data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar produto no Stripe:', error);
    throw error;
  }
};
