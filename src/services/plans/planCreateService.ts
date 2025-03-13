
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { updateStripeProduct } from "../stripeService";
import { mapDbPlanToPlan, processFeaturesInput } from "./planUtils";

export async function createPlan(plan: Omit<Plan, 'id'>): Promise<Plan | null> {
  try {
    toast.loading('Criando plano e produto no Stripe...');
    
    // 1. Primeiro, criar o produto e preço no Stripe
    try {
      const stripeData = await updateStripeProduct({
        stripeProductId: '',  // Vazio para criar novo produto
        stripePriceId: '',    // Vazio para criar novo preço
        name: plan.name,
        description: plan.description,
        price: plan.price,
        active: plan.active !== undefined ? plan.active : true,
        credits: plan.credits // Now this property exists in the Plan type
      });
      
      if (!stripeData || !stripeData.product || !stripeData.price) {
        throw new Error('Dados inválidos retornados pelo Stripe');
      }
      
      // Process benefits as features
      const benefits = processFeaturesInput(plan.benefits);
      
      // 2. Criar o plano no Supabase com os IDs do Stripe
      const { data, error } = await supabase
        .from('plans')
        .insert({
          name: plan.name,
          price: plan.price,
          description: plan.description,
          features: benefits, // Use benefits as features in the database
          active: plan.active,
          stripe_product_id: stripeData.product.id,
          stripe_price_id: stripeData.price.id,
          credits: plan.credits,
          short_description: plan.shortDescription,
          coming_soon: plan.comingSoon,
          action_button_text: plan.actionButtonText,
          how_it_works: processFeaturesInput(plan.howItWorks),
          icon: plan.icon
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar plano:', error);
        throw error;
      }
      
      const newPlan = mapDbPlanToPlan(data);
      toast.dismiss();
      toast.success('Plano criado e registrado no Stripe com sucesso!');
      
      return newPlan;
    } catch (stripeError) {
      console.error('Erro ao criar produto no Stripe:', stripeError);
      throw new Error(`Erro ao criar produto no Stripe: ${stripeError.message}`);
    }
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    toast.dismiss();
    toast.error(`Não foi possível criar o plano: ${error.message}`);
    return null;
  }
}
