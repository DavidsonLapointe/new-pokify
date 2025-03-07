
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
  returnIds?: boolean;
}

export const updateStripeProduct = async (params: UpdateStripeProductParams) => {
  console.log('Atualizando produto no Stripe:', params);
  
  try {
    // Certifique-se de que returnIds está definido como true para receber os IDs do Stripe
    const requestParams = {
      ...params,
      returnIds: true
    };
    
    const { data, error } = await supabase.functions.invoke('update-stripe-product', {
      body: requestParams
    });
    
    if (error) {
      console.error('Erro ao invocar função do Stripe:', error);
      throw error;
    }
    
    // Validar a resposta
    if (!data || !data.success) {
      console.error('Erro retornado pelo Stripe:', data?.error || 'Resposta inválida');
      throw new Error(data?.error || 'Erro ao processar a solicitação no Stripe');
    }
    
    console.log('Produto atualizado com sucesso no Stripe:', data);
    
    // Verificar se temos os IDs do produto e preço no Stripe
    if (!data.product?.id || !data.price?.id) {
      console.error('IDs do Stripe não recebidos na resposta:', data);
      throw new Error('IDs do produto/preço não retornados pelo Stripe');
    }
    
    // Verificar se um novo preço foi criado
    const priceUpdated = data.priceUpdated || false;
    
    return {
      success: true,
      product: data.product,
      price: data.price,
      priceUpdated
    };
  } catch (error) {
    console.error('Erro ao atualizar produto no Stripe:', error);
    throw error;
  }
};
