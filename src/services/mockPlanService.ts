import { Plan } from "@/components/admin/plans/plan-form-schema";
import { mockPlans } from "@/mocks/plansMocks";
import { toast } from "sonner";

// Função para buscar todos os planos
export async function fetchPlans(): Promise<Plan[]> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    toast.error('Não foi possível carregar os planos.');
    return [];
  }
}

// Função para buscar um plano pelo ID
export async function fetchPlanById(id: string): Promise<Plan | null> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar plano ${id}:`, error);
    toast.error('Não foi possível carregar os detalhes do plano.');
    return null;
  }
}

// Função para criar um plano (mock)
export async function createPlan(plan: Omit<Plan, 'id'>): Promise<Plan> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPlan: Plan = {
      ...plan,
      id: `mock-plan-${Date.now()}`
    };
    
    return newPlan;
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    toast.error('Não foi possível criar o plano.');
    throw error;
  }
}

// Função para atualizar um plano (mock)
export async function updatePlan(plan: Plan): Promise<Plan> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return plan;
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    toast.error('Não foi possível atualizar o plano.');
    throw error;
  }
}
