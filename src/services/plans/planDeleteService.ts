import { supabase } from "@/integrations/supabase/realClient";
import { updateStripeProduct } from "../stripeService";
import { toast } from "sonner";

/**
 * Soft delete a plan by changing its active status to false
 * This keeps the plan in the database for historical records but makes it inactive
 * Also deactivates the product in Stripe if it's connected
 * 
 * @param id The plan ID to delete
 * @returns Promise<boolean> true if successful, false if failed
 */
export async function deletePlan(id: string): Promise<boolean> {
  try {
    toast.loading('Desativando plano...');
    
    // 1. First, get the current plan to have all information
    const { data: currentPlan, error: fetchError } = await supabase
      .from('planos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Erro ao buscar plano ${id}:`, fetchError);
      throw fetchError;
    }
    
    // 2. If the plan has a Stripe connection, deactivate it in Stripe first
    if (currentPlan.stripe_product_id) {
      try {
        await updateStripeProduct({
          stripeProductId: currentPlan.stripe_product_id,
          stripePriceId: currentPlan.stripe_price_id || '',
          name: currentPlan.name,
          description: currentPlan.description,
          price: currentPlan.price,
          active: false, // Setting to inactive
          credits: currentPlan.credits
        });
        
        console.log('Produto desativado no Stripe com sucesso');
      } catch (stripeError) {
        console.error('Erro ao desativar produto no Stripe:', stripeError);
        // Continue anyway to deactivate in our database
      }
    }
    
    // 3. Update the plan status to inactive in our database
    const { error: updateError } = await supabase
      .from('planos')
      .update({ active: false })
      .eq('id', id);
    
    if (updateError) {
      console.error(`Erro ao desativar plano ${id}:`, updateError);
      throw updateError;
    }
    
    toast.dismiss();
    toast.success('Plano desativado com sucesso!');
    
    return true;
  } catch (error) {
    console.error(`Erro ao desativar plano ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível desativar o plano: ${error.message}`);
    return false;
  }
}
