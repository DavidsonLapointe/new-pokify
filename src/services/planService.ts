
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { updateStripeProduct } from "@/services/stripeService";

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar planos:', error);
      throw error;
    }
    
    return data.map(mapDbPlanToPlan);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    toast.error('Não foi possível carregar os planos.');
    return [];
  }
}

export async function fetchPlanById(id: string): Promise<Plan | null> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar plano ${id}:`, error);
      throw error;
    }
    
    return mapDbPlanToPlan(data);
  } catch (error) {
    console.error(`Erro ao buscar plano ${id}:`, error);
    toast.error('Não foi possível carregar os detalhes do plano.');
    return null;
  }
}

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
        credits: plan.credits
      });
      
      if (!stripeData || !stripeData.product || !stripeData.price) {
        throw new Error('Dados inválidos retornados pelo Stripe');
      }
      
      // Process features safely based on type
      let features: string[] = [];
      
      if (plan.features !== undefined) {
        if (Array.isArray(plan.features)) {
          features = plan.features;
        } else if (typeof plan.features === 'string') {
          // Convertemos explicitamente para string e então usamos split
          const featuresString: string = plan.features;
          features = featuresString.split('\n').filter((f: string) => f.trim().length > 0);
        } else if (plan.features === null) {
          // Handle null case explicitly
          features = [];
        }
      }
      
      // 2. Criar o plano no Supabase com os IDs do Stripe
      const { data, error } = await supabase
        .from('plans')
        .insert([{
          name: plan.name,
          price: plan.price,
          description: plan.description,
          features: features,
          active: plan.active,
          stripe_product_id: stripeData.product.id,
          stripe_price_id: stripeData.price.id,
          credits: plan.credits
        }])
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
      
      // Process features safely based on type
      let features: string[] | undefined = undefined;
      
      if (plan.features !== undefined) {
        if (Array.isArray(plan.features)) {
          features = plan.features;
        } else if (typeof plan.features === 'string') {
          // Convertemos explicitamente para string e então usamos split
          const featuresString: string = plan.features;
          features = featuresString.split('\n').filter((f: string) => f.trim().length > 0);
        } else if (plan.features === null) {
          // Handle null case explicitly
          features = [];
        }
      }
      
      const updateData: Record<string, any> = {};
      
      // Only include defined fields in the update
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.price !== undefined) updateData.price = plan.price;
      if (plan.description !== undefined) updateData.description = plan.description;
      if (plan.active !== undefined) updateData.active = plan.active;
      if (features !== undefined) updateData.features = features;
      
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

function mapDbPlanToPlan(dbPlan: any): Plan {
  return {
    id: dbPlan.id,
    name: dbPlan.name,
    price: parseFloat(dbPlan.price),
    description: dbPlan.description,
    features: dbPlan.features || [], // Sempre garantir que features seja um array
    active: dbPlan.active,
    stripeProductId: dbPlan.stripe_product_id,
    stripePriceId: dbPlan.stripe_price_id,
    credits: dbPlan.credits,
  };
}
