
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { mapDbPlanToPlan } from "./planUtils";
import { mockPlans } from "@/mocks/plansMocks";

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
    
    // Se não houver dados no Supabase, usamos os mocks
    if (!data || data.length === 0) {
      console.log('Usando planos mockados');
      return mockPlans.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        shortDescription: plan.shortDescription || plan.description,
        description: plan.description,
        benefits: plan.benefits || plan.features,
        active: plan.active,
        stripeProductId: plan.stripeProductId,
        stripePriceId: plan.stripePriceId,
        credits: plan.credits
      }));
    }
    
    return data.map(mapDbPlanToPlan);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    toast.error('Não foi possível carregar os planos.');
    // Em caso de erro, retornamos os planos mockados
    return mockPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      shortDescription: plan.shortDescription || plan.description,
      description: plan.description,
      benefits: plan.benefits || plan.features,
      active: plan.active,
      stripeProductId: plan.stripeProductId,
      stripePriceId: plan.stripePriceId,
      credits: plan.credits
    }));
  }
}

export async function fetchPlanById(id: string): Promise<Plan | null> {
  try {
    // Tenta buscar no Supabase
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar plano ${id}:`, error);
      // Se não encontrar no banco, verifica nos mocks
      const mockPlan = mockPlans.find(p => p.id.toString() === id);
      if (mockPlan) {
        return {
          id: mockPlan.id,
          name: mockPlan.name,
          price: mockPlan.price,
          shortDescription: mockPlan.shortDescription || mockPlan.description,
          description: mockPlan.description,
          benefits: mockPlan.benefits || mockPlan.features,
          active: mockPlan.active,
          stripeProductId: mockPlan.stripeProductId,
          stripePriceId: mockPlan.stripePriceId,
          credits: mockPlan.credits
        };
      }
      throw error;
    }
    
    return mapDbPlanToPlan(data);
  } catch (error) {
    console.error(`Erro ao buscar plano ${id}:`, error);
    toast.error('Não foi possível carregar os detalhes do plano.');
    return null;
  }
}
