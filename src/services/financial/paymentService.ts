
import { FinancialTitle } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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

  // Se for um título pro-rata, ativa a organização e o usuário admin
  if (title.type === 'pro_rata') {
    const { error: orgError } = await supabase
      .from('organizations')
      .update({
        status: 'active',
        pending_reason: null
      })
      .eq('id', organization.id.toString());

    if (orgError) throw orgError;

    const { error: userError } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('organization_id', organization.id.toString())
      .eq('role', 'admin');

    if (userError) throw userError;
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
  paymentMethod?: 'pix' | 'boleto'
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
