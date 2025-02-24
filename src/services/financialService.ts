
import { FinancialTitle, CreateFinancialTitleDTO } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const createProRataTitle = async (organization: Organization, proRataValue: number): Promise<FinancialTitle | null> => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

  try {
    const { data: title, error } = await supabase
      .from('financial_titles')
      .insert({
        organization_id: organization.id,
        type: 'pro_rata',
        value: proRataValue,
        due_date: dueDate.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: title.id,
      organizationId: title.organization_id,
      type: title.type,
      value: title.value,
      dueDate: title.due_date,
      status: title.status,
      createdAt: title.created_at,
      paymentDate: title.payment_date,
      paymentMethod: title.payment_method,
    };
  } catch (error) {
    console.error('Erro ao criar título pro rata:', error);
    return null;
  }
};

export const createMonthlyTitle = async (dto: CreateFinancialTitleDTO): Promise<FinancialTitle | null> => {
  try {
    const { data: title, error } = await supabase
      .from('financial_titles')
      .insert({
        organization_id: dto.organizationId,
        type: 'mensalidade',
        value: dto.value,
        due_date: dto.dueDate,
        reference_month: dto.referenceMonth,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: title.id,
      organizationId: title.organization_id,
      type: title.type,
      value: title.value,
      dueDate: title.due_date,
      status: title.status,
      referenceMonth: title.reference_month,
      createdAt: title.created_at,
      paymentDate: title.payment_date,
      paymentMethod: title.payment_method,
    };
  } catch (error) {
    console.error('Erro ao criar título mensal:', error);
    return null;
  }
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

export const getOrganizationTitles = async (organizationId: string): Promise<FinancialTitle[]> => {
  try {
    const { data: titles, error } = await supabase
      .from('financial_titles')
      .select('*')
      .eq('organization_id', organizationId)
      .order('due_date', { ascending: true });

    if (error) throw error;

    return titles.map(title => ({
      id: title.id,
      organizationId: title.organization_id,
      type: title.type,
      value: title.value,
      dueDate: title.due_date,
      status: title.status,
      referenceMonth: title.reference_month,
      createdAt: title.created_at,
      paymentDate: title.payment_date,
      paymentMethod: title.payment_method,
    }));
  } catch (error) {
    console.error('Erro ao buscar títulos da organização:', error);
    return [];
  }
};

export const getAllTitles = async (): Promise<FinancialTitle[]> => {
  try {
    const { data: titles, error } = await supabase
      .from('financial_titles')
      .select(`
        *,
        organization:organizations (
          name,
          nome_fantasia,
          cnpj
        )
      `)
      .order('due_date', { ascending: true });

    if (error) throw error;

    return titles.map(title => ({
      id: title.id,
      organizationId: title.organization_id,
      type: title.type,
      value: title.value,
      dueDate: title.due_date,
      status: title.status,
      referenceMonth: title.reference_month,
      createdAt: title.created_at,
      paymentDate: title.payment_date,
      paymentMethod: title.payment_method,
    }));
  } catch (error) {
    console.error('Erro ao buscar todos os títulos:', error);
    return [];
  }
};
