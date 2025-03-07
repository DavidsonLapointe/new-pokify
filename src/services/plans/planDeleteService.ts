
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { updateStripeProduct } from "../stripeService";
import { Plan } from "@/components/admin/plans/plan-form-schema";

export async function deletePlan(id: string): Promise<boolean> {
  try {
    toast.loading('Desativando plano no Stripe...');
    
    // 1. Buscar plano para obter IDs do Stripe
    const { data: currentPlan, error: fetchError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error(`Erro ao buscar plano para exclusão ${id}:`, fetchError);
      throw fetchError;
    }
    
    // 2. Desativar o produto no Stripe
    try {
      await updateStripeProduct({
        stripeProductId: currentPlan.stripe_product_id,
        stripePriceId: currentPlan.stripe_price_id,
        name: currentPlan.name,
        description: currentPlan.description,
        price: parseFloat(currentPlan.price),
        active: false, // Desativar o produto
        credits: currentPlan.credits
      });
      
      // 3. Atualizar o status do plano no Supabase (soft delete)
      const { error } = await supabase
        .from('plans')
        .update({ active: false })
        .eq('id', id);
      
      if (error) {
        console.error(`Erro ao desativar plano ${id}:`, error);
        throw error;
      }
      
      toast.dismiss();
      toast.success('Plano desativado com sucesso!');
      
      return true;
    } catch (stripeError) {
      console.error('Erro ao desativar produto no Stripe:', stripeError);
      throw new Error(`Erro ao desativar produto no Stripe: ${stripeError.message}`);
    }
  } catch (error) {
    console.error(`Erro ao desativar plano ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível desativar o plano: ${error.message}`);
    return false;
  }
}
