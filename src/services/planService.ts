
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";

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
    // Process features safely based on type
    let features: string[] = [];
    
    if (plan.features !== undefined) {
      if (Array.isArray(plan.features)) {
        features = plan.features;
      } else if (typeof plan.features === 'string') {
        // Aqui é onde ocorria o erro - agora verificamos explicitamente se é uma string
        features = plan.features.split('\n').filter((f: string) => f.trim().length > 0);
      } else if (plan.features === null) {
        // Handle null case explicitly
        features = [];
      }
    }
    
    console.log("Creating plan with features:", features);
    console.log("Full plan data:", {
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: features,
      active: plan.active,
      stripe_product_id: plan.stripeProductId,
      stripe_price_id: plan.stripePriceId,
      credits: plan.credits
    });

    const { data, error } = await supabase
      .from('plans')
      .insert([{
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: features,
        active: plan.active,
        stripe_product_id: plan.stripeProductId,
        stripe_price_id: plan.stripePriceId,
        credits: plan.credits
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
    
    return mapDbPlanToPlan(data);
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    toast.error('Não foi possível criar o plano.');
    return null;
  }
}

export async function updatePlan(id: number | string, plan: Partial<Plan>): Promise<Plan | null> {
  try {
    console.log('Atualizando plano, ID:', id);
    console.log('Dados do plano para atualização:', plan);
    
    // Process features safely based on type
    let features: string[] | undefined = undefined;
    
    if (plan.features !== undefined) {
      if (Array.isArray(plan.features)) {
        features = plan.features;
      } else if (typeof plan.features === 'string') {
        // Aqui é onde ocorria o segundo erro - mesma correção
        features = plan.features.split('\n').filter((f: string) => f.trim().length > 0);
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
    if (plan.stripeProductId !== undefined) updateData.stripe_product_id = plan.stripeProductId;
    if (plan.stripePriceId !== undefined) updateData.stripe_price_id = plan.stripePriceId;
    if (features !== undefined) updateData.features = features;
    
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
    
    console.log('Dados finais de atualização:', updateData);
    
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
    
    console.log('Plano atualizado com sucesso:', data);
    return mapDbPlanToPlan(data);
  } catch (error) {
    console.error(`Erro ao atualizar plano ${id}:`, error);
    toast.error('Não foi possível atualizar o plano.');
    return null;
  }
}

// Função auxiliar para mapear os dados do BD para o formato usado no front-end
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
