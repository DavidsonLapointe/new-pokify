
import { FinancialTitle } from "@/types/financial";
import { supabase } from "@/integrations/supabase/client";

export const getOrganizationTitles = async (organizationId: string): Promise<FinancialTitle[]> => {
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
      .eq('organization_id', organizationId)
      .order('due_date', { ascending: true });

    if (error) throw error;

    return titles.map(title => ({
      id: title.id,
      organizationId: title.organization_id,
      type: title.type,
      value: Number(title.value),
      dueDate: title.due_date,
      status: title.status,
      referenceMonth: title.reference_month,
      createdAt: title.created_at,
      paymentDate: title.payment_date,
      paymentMethod: title.payment_method,
      paymentStatusDetails: title.payment_status_details,
      organization: title.organization
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
      value: Number(title.value),
      dueDate: title.due_date,
      status: title.status,
      referenceMonth: title.reference_month,
      createdAt: title.created_at,
      paymentDate: title.payment_date,
      paymentMethod: title.payment_method,
      paymentStatusDetails: title.payment_status_details,
      organization: title.organization
    }));
  } catch (error) {
    console.error('Erro ao buscar todos os títulos:', error);
    return [];
  }
};
