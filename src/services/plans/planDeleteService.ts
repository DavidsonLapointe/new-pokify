
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { updateStripeProduct } from "../stripeService";

/**
 * Soft delete a plan by setting its active status to false.
 * This also deactivates the corresponding product in Stripe.
 * 
 * @param id The ID of the plan to delete
 * @returns True if the plan was successfully deleted, false otherwise
 */
export async function deletePlan(id: string | number): Promise<boolean> {
  try {
    // First, fetch the plan to get its Stripe IDs
    const { data: plan, error: fetchError } = await supabase
      .from('plans')
      .select('stripe_product_id, stripe_price_id, name')
      .eq('id', id.toString())
      .single();
      
    if (fetchError) {
      console.error(`Erro ao buscar plano ${id}:`, fetchError);
      throw fetchError;
    }
    
    if (!plan) {
      throw new Error('Plano não encontrado');
    }
    
    toast.loading(`Desativando plano "${plan.name}"...`);
    
    // Deactivate the product in Stripe if it has a Stripe product ID
    if (plan.stripe_product_id) {
      try {
        await updateStripeProduct({
          stripeProductId: plan.stripe_product_id,
          stripePriceId: plan.stripe_price_id || '',
          name: plan.name, // We need to pass all required fields
          description: '', // We'll pass empty for required fields
          price: 0, // This won't be used since we're just deactivating
          active: false, // Set to inactive
          returnIds: false // No need to return IDs
        });
        
        console.log(`Produto desativado no Stripe: ${plan.stripe_product_id}`);
      } catch (stripeError) {
        console.error('Erro ao desativar produto no Stripe:', stripeError);
        // Continue anyway to update the database
      }
    }
    
    // Soft delete in the database by setting active to false
    const { error: updateError } = await supabase
      .from('plans')
      .update({ active: false })
      .eq('id', id.toString());
    
    if (updateError) {
      console.error(`Erro ao desativar plano ${id}:`, updateError);
      throw updateError;
    }
    
    toast.dismiss();
    toast.success(`Plano "${plan.name}" desativado com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao desativar plano ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível desativar o plano: ${error.message}`);
    return false;
  }
}
