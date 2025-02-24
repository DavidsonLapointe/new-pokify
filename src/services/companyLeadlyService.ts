
import { supabase } from "@/integrations/supabase/client";
import { CompanyLeadly, UpdateCompanyLeadlyDTO } from "@/types/company-leadly";
import { toast } from "sonner";

export const fetchCompanyLeadly = async (): Promise<CompanyLeadly | null> => {
  const { data, error } = await supabase
    .from('company_leadly')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar dados da empresa:', error);
    toast.error('Erro ao carregar dados da empresa');
    return null;
  }

  return data;
};

export const updateCompanyLeadly = async (
  id: string,
  updateData: UpdateCompanyLeadlyDTO
): Promise<CompanyLeadly | null> => {
  const { data, error } = await supabase
    .from('company_leadly')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar empresa:', error);
    toast.error('Erro ao atualizar dados da empresa');
    return null;
  }

  toast.success('Dados da empresa atualizados com sucesso!');
  return data;
};
