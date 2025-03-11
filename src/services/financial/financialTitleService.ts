
import { FinancialTitle, CreateFinancialTitleDTO } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const createMensalidadeTitle = async (organization: Organization, mensalidadeValue: number): Promise<FinancialTitle | null> => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

  try {
    const { data: title, error } = await supabase
      .from('financial_titles')
      .insert([{
        organization_id: organization.id.toString(),
        type: 'mensalidade' as const,
        value: mensalidadeValue,
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
    console.error('Erro ao criar título de mensalidade:', error);
    return null;
  }
};

export const createMonthlyTitle = async (dto: CreateFinancialTitleDTO): Promise<FinancialTitle | null> => {
  try {
    // Para títulos de mensalidade, usamos a data específica fornecida
    // ou calculamos para o dia 1 do mês atual se nenhuma data for fornecida
    let dueDate = dto.dueDate;
    if (!dueDate && dto.type === 'mensalidade') {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      dueDate = firstDayOfMonth.toISOString();
    }

    const { data: title, error } = await supabase
      .from('financial_titles')
      .insert([{
        organization_id: dto.organizationId.toString(),
        type: dto.type,
        value: dto.value,
        due_date: dueDate,
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
