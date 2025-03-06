
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
    
    if (Array.isArray(plan.features)) {
      features = plan.features;
    } else if (typeof plan.features === 'string') {
      features = plan.features.split('\n').filter((f: string) => f.trim().length > 0);
    } else if (plan.features) {
      // Fallback - convert to string if possible
      const featuresStr = String(plan.features);
      features = featuresStr.split('\n').filter((f: string) => f.trim().length > 0);
    }
    
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
    console.log('Atualizando plano:', id, plan);
    
    // Process features safely based on type
    let features: string[] | undefined = undefined;
    
    if (plan.features) {
      if (Array.isArray(plan.features)) {
        features = plan.features;
      } else if (typeof plan.features === 'string') {
        features = plan.features.split('\n').filter((f: string) => f.trim().length > 0);
      } else {
        // Fallback - convert to string if possible
        const featuresStr = String(plan.features);
        features = featuresStr.split('\n').filter((f: string) => f.trim().length > 0);
      }
    }
    
    const updateData: any = {
      name: plan.name,
      price: plan.price,
      description: plan.description,
      active: plan.active,
      stripe_product_id: plan.stripeProductId,
      stripe_price_id: plan.stripePriceId,
      credits: plan.credits
    };
    
    // Only add features if it exists
    if (features) {
      updateData.features = features;
    }
    
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
    features: dbPlan.features,
    active: dbPlan.active,
    stripeProductId: dbPlan.stripe_product_id,
    stripePriceId: dbPlan.stripe_price_id,
    credits: dbPlan.credits,
  };
}
