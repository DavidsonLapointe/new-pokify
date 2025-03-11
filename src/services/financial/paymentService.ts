
import { FinancialTitle } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getOrganizationSubscription } from "@/services/subscriptionService";

export const handleTitlePayment = async (
  title: FinancialTitle, 
  organization: Organization
): Promise<FinancialTitle> => {
  const { data: updatedTitle, error } = await supabase
    .from('financial_titles')
    .update({
      status: 'paid' as const,
      payment_date: new Date().toISOString(),
      payment_method: 'pix' as const
    })
    .eq('id', title.id)
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao processar pagamento');
  }

  // Se for um título mensalidade ou pro-rata, atualiza o payment_status da organização
  if (title.type === 'pro_rata' || title.type === 'mensalidade') {
    const { error: orgError } = await supabase
      .from('organizations')
      .update({
        payment_status: 'completed'
      })
      .eq('id', organization.id.toString());

    if (orgError) throw orgError;
    
    // Verificamos se existe alguma assinatura inactive para esta organização
    const subscription = await getOrganizationSubscription(organization.id.toString());
    
    // Se existir uma assinatura e ela estiver inativa, vamos acionar a função para criar no Stripe
    if (subscription && subscription.status === 'inactive') {
      try {
        // Chamar a função Edge Function para criar a assinatura no Stripe
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-stripe-subscription', {
          body: {
            organizationId: organization.id.toString(),
            planType: organization.plan
          }
        });
        
        if (stripeError) {
          console.error('Erro ao criar assinatura no Stripe:', stripeError);
        } else {
          console.log('Assinatura criada com sucesso no Stripe:', stripeData);
        }
      } catch (stripeCreateError) {
        console.error('Exceção ao criar assinatura no Stripe:', stripeCreateError);
        // Não vamos interromper o fluxo se falhar a criação no Stripe
        // Apenas registramos o erro para investigação posterior
      }
    }
  }

  return {
    ...title,
    status: 'paid',
    paymentDate: updatedTitle.payment_date,
    paymentMethod: updatedTitle.payment_method
  };
};

export const updateTitleStatus = async (
  titleId: string, 
  status: 'paid' | 'overdue', 
  paymentMethod?: 'pix' | 'boleto' | 'credit_card'
): Promise<boolean> => {
  try {
    const updateData: any = {
      status,
    };

    if (status === 'paid') {
      updateData.payment_date = new Date().toISOString();
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }
    }

    const { error } = await supabase
      .from('financial_titles')
      .update(updateData)
      .eq('id', titleId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status do título:', error);
    return false;
  }
};
