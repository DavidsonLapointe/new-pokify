
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { updateStripeProduct } from "../stripeService";
import { mapDbPlanToPlan, processFeaturesInput } from "./planUtils";

export async function updatePlan(id: number | string, plan: Partial<Plan>): Promise<Plan | null> {
  try {
    // Buscar plano atual para ter informações completas
    const { data: currentPlan, error: fetchError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id.toString())
      .single();
      
    if (fetchError) {
      console.error(`Erro ao buscar plano atual ${id}:`, fetchError);
      throw fetchError;
    }
    
    toast.loading('Atualizando plano e produto no Stripe...');
    
    // 1. Atualizar produto no Stripe
    try {
      // Se já existe um ID do Stripe, atualiza; caso contrário, cria um novo
      const stripeProductId = currentPlan.stripe_product_id || '';
      const stripePriceId = currentPlan.stripe_price_id || '';
      
      const stripeData = await updateStripeProduct({
        stripeProductId,
        stripePriceId,
        name: plan.name || currentPlan.name,
        description: plan.description || currentPlan.description,
        price: plan.price !== undefined ? plan.price : currentPlan.price,
        active: plan.active !== undefined ? plan.active : currentPlan.active,
        credits: plan.credits !== undefined ? plan.credits : currentPlan.credits
      });
      
      if (!stripeData || !stripeData.product || !stripeData.price) {
        throw new Error('Dados inválidos retornados pelo Stripe');
      }
      
      // Process benefits safely
      let benefits = undefined;
      if (plan.benefits !== undefined) {
        benefits = processFeaturesInput(plan.benefits);
      }
      
      // Process howItWorks safely
      let howItWorks = undefined;
      if (plan.howItWorks !== undefined) {
        howItWorks = processFeaturesInput(plan.howItWorks);
      }
      
      const updateData: Record<string, any> = {};
      
      // Only include defined fields in the update
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.price !== undefined) updateData.price = plan.price;
      if (plan.shortDescription !== undefined) updateData.short_description = plan.shortDescription;
      if (plan.description !== undefined) updateData.description = plan.description;
      if (plan.active !== undefined) updateData.active = plan.active;
      if (plan.comingSoon !== undefined) updateData.coming_soon = plan.comingSoon;
      if (plan.actionButtonText !== undefined) updateData.action_button_text = plan.actionButtonText;
      if (benefits !== undefined) updateData.benefits = benefits;
      if (howItWorks !== undefined) updateData.how_it_works = howItWorks;
      
      // Adicionar os IDs do Stripe
      updateData.stripe_product_id = stripeData.product.id;
      updateData.stripe_price_id = stripeData.price.id;
      
      // Handle credits field properly based on database int4 type
      if (plan.credits !== undefined) {
        // Ensure credits is an integer or null
        if (typeof plan.credits === 'string') {
          updateData.credits = parseInt(plan.credits, 10);
        } else if (typeof plan.credits === 'number') {
          updateData.credits = Math.round(plan.credits); // Ensure it's an integer
        } else {
          updateData.credits = plan.credits; // null or undefined
        }
      }
      
      // 2. Atualizar plano no Supabase
      const { data, error } = await supabase
        .from('plans')
        .update(updateData)
        .eq('id', id.toString())
        .select()
        .single();
      
      if (error) {
        console.error(`Erro ao atualizar plano ${id}:`, error);
        throw error;
      }
      
      const updatedPlan = mapDbPlanToPlan(data);
      toast.dismiss();
      toast.success('Plano atualizado e sincronizado com o Stripe com sucesso!');
      
      return updatedPlan;
    } catch (stripeError) {
      console.error('Erro ao atualizar produto no Stripe:', stripeError);
      throw new Error(`Erro ao atualizar produto no Stripe: ${stripeError.message}`);
    }
  } catch (error) {
    console.error(`Erro ao atualizar plano ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível atualizar o plano: ${error.message}`);
    return null;
  }
}
