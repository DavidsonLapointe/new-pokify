
import { FinancialTitle } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getOrganizationSubscription } from "@/services/subscriptionService";

export const handleTitlePayment = async (
  title: FinancialTitle, 
  organization: Organization
): Promise<FinancialTitle> => {
  // Como estamos trabalhando apenas com o frontend, vamos simular um pagamento bem-sucedido
  // em vez de chamar o Supabase
  
  console.log("Processando pagamento para o título:", title);
  
  // Simular o retorno de um título atualizado
  const updatedTitle = {
    ...title,
    status: 'paid' as const,
    payment_date: new Date().toISOString(),
    payment_method: 'pix' as const
  };

  // Se for um título pro-rata, atualizamos também o status da organização
  if (title.type === 'pro_rata') {
    console.log("Título pro-rata: atualizando status da organização");
    
    // Para desenvolvimento frontend, apenas logamos a ação
    // Normalmente chamaríamos o Supabase aqui
    
    // Verificamos se existe alguma assinatura inactive para esta organização
    try {
      const subscription = await getOrganizationSubscription(organization.id.toString());
      
      // Se existir uma assinatura e ela estiver inativa, simulamos sua ativação
      if (subscription && subscription.status === 'inactive') {
        console.log("Ativando assinatura para organização:", organization.id);
        // Simulação de ativação bem-sucedida
      }
    } catch (error) {
      // Apenas logamos o erro, mas não interrompemos o fluxo
      console.error("Erro ao verificar assinatura:", error);
    }
  }

  // Retornar o título atualizado com a estrutura esperada pelo componente
  return {
    ...title,
    status: 'paid',
    paymentDate: new Date().toISOString(),
    paymentMethod: 'pix'
  };
};

export const updateTitleStatus = async (
  titleId: string, 
  status: 'paid' | 'overdue', 
  paymentMethod?: 'pix' | 'boleto' | 'credit_card'
): Promise<boolean> => {
  try {
    console.log(`Atualizando título ${titleId} para status ${status}`);
    
    // Em vez de chamar o Supabase, apenas simulamos uma atualização bem-sucedida
    // para desenvolvimento frontend
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status do título:', error);
    return false;
  }
};
