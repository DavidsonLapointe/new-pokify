
import { supabase } from "@/integrations/supabase/client";

/**
 * Calculates the pro-rata value based on the plan's monthly price
 * and the remaining days in the current month
 */
export const calculateProRataValue = (planValue: number): number => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - today.getDate();
  return parseFloat(((planValue / daysInMonth) * remainingDays).toFixed(2));
};

/**
 * Obtem o valor do plano diretamente do banco de dados
 */
export const getPlanValue = async (planType: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('price')
      .eq('name', planType)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao obter preço do plano:', error);
      return getDefaultPlanValue(planType);
    }
    
    if (data) {
      return parseFloat(data.price);
    } else {
      // Fallback para valores padrão caso não encontre o plano
      return getDefaultPlanValue(planType);
    }
  } catch (error) {
    console.error('Erro ao obter preço do plano:', error);
    return getDefaultPlanValue(planType);
  }
};

/**
 * Valores padrão para fallback (mantidos para compatibilidade)
 */
export const getPlanValues = () => {
  return {
    basic: 99.90,
    professional: 199.90,
    enterprise: 399.90
  };
};

/**
 * Função auxiliar para obter o valor padrão do plano caso a busca no banco de dados falhe
 */
const getDefaultPlanValue = (planType: string): number => {
  const planValues = getPlanValues();
  const normalizedPlanType = planType.toLowerCase();
  
  // Verificando se o tipo de plano existe no objeto planValues
  if (normalizedPlanType in planValues) {
    // Use a type assertion here to tell TypeScript this is a valid key
    return planValues[normalizedPlanType as keyof typeof planValues];
  } else {
    return planValues.professional; // Fallback para o plano professional se não encontrar
  }
};
