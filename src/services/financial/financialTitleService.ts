
import { FinancialTitle, CreateFinancialTitleDTO } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const createProRataTitle = async (organization: Organization, proRataValue: number): Promise<FinancialTitle | null> => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

  try {
    const { data: title, error } = await supabase
      .from('financial_titles')
      .insert([{
        organization_id: organization.id.toString(),
        type: 'pro_rata' as const,
        value: proRataValue,
        due_date: dueDate.toISOString(),
        status: 'pending' as const
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: title.id,
      organizationId: title.organization_id,
      type: title.type,
      value: Number(title.value),
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
      .insert([{
        organization_id: dto.organizationId.toString(),
        type: 'mensalidade' as const,
        value: dto.value,
        due_date: dto.dueDate,
        reference_month: dto.referenceMonth,
        status: 'pending' as const
      }])
      .select()
      .single();

    if (error) throw error;

    return {
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
    };
  } catch (error) {
    console.error('Erro ao criar título mensal:', error);
    return null;
  }
};
