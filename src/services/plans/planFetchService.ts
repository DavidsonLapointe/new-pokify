
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { mapDbPlanToPlan } from "./planUtils";

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
