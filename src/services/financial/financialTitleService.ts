
import { FinancialTitle, CreateFinancialTitleDTO } from "@/types/financial";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { mockTitles } from "./mockTitlesData";

// Since we're only working with frontend for now, let's use mock data
// and simulate API calls to avoid database type errors

export const createProRataTitle = async (organization: Organization, proRataValue: number): Promise<FinancialTitle | null> => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

  try {
    // For frontend only work, we'll just create a mock title and return it
    const newTitle: FinancialTitle = {
      id: `mock-${Date.now()}`,
      organizationId: organization.id.toString(),
      type: 'pro_rata',
      value: proRataValue,
      dueDate: dueDate.toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // In a real implementation with updated Supabase types, we would do:
    // const { data: title, error } = await supabase
    //   .from('financial_titles')
    //   .insert({
    //     organization_id: organization.id.toString(),
    //     type: 'pro_rata',
    //     value: proRataValue,
    //     due_date: dueDate.toISOString(),
    //     status: 'pending'
    //   })
    //   .select()
    //   .single();
    
    return newTitle;
  } catch (error) {
    console.error('Erro ao criar título pro rata:', error);
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

    // For frontend only work, we'll just create a mock title and return it
    const newTitle: FinancialTitle = {
      id: `mock-${Date.now()}`,
      organizationId: dto.organizationId.toString(),
      type: dto.type,
      value: dto.value,
      dueDate: dueDate,
      status: 'pending',
      referenceMonth: dto.referenceMonth,
      createdAt: new Date().toISOString(),
      moduleId: dto.moduleId // Incluindo moduleId para títulos do tipo setup
    };

    // In a real implementation with updated Supabase types, we would do:
    // const { data: title, error } = await supabase
    //   .from('financial_titles')
    //   .insert({
    //     organization_id: dto.organizationId.toString(),
    //     type: dto.type,
    //     value: dto.value,
    //     due_date: dueDate,
    //     reference_month: dto.referenceMonth,
    //     module_id: dto.moduleId, // Include moduleId for setup titles
    //     status: 'pending'
    //   })
    //   .select()
    //   .single();

    return newTitle;
  } catch (error) {
    console.error('Erro ao criar título:', error);
    return null;
  }
};

// Add a new function specifically for creating setup titles
export const createSetupTitle = async (
  organizationId: string, 
  moduleId: string | number, 
  moduleName: string, 
  setupValue: number
): Promise<FinancialTitle | null> => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5); // Vencimento em 5 dias para títulos de setup
    
    // For frontend only work, we'll just create a mock title and return it
    const newTitle: FinancialTitle = {
      id: `mock-${Date.now()}`,
      organizationId: organizationId,
      type: 'setup',
      value: setupValue,
      dueDate: dueDate.toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      moduleId: moduleId,
      moduleName: moduleName
    };
    
    return newTitle;
  } catch (error) {
    console.error('Erro ao criar título de setup:', error);
    return null;
  }
};

// Add this to mock fetching all titles
export const getAllTitles = async (): Promise<FinancialTitle[]> => {
  // For frontend development, return the mockTitles
  return mockTitles;
};
