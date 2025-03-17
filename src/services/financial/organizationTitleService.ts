
import { FinancialTitle } from "@/types/financial";
import { mockTitles } from "./mockTitlesData";

// Esta função obtém todos os títulos financeiros
export const getAllTitles = async (): Promise<FinancialTitle[]> => {
  try {
    // Em um ambiente de produção, isso se conectaria ao Supabase
    // const { data: titles, error } = await supabase
    //   .from('financial_titles')
    //   .select('*, organization:organizations(*)')
    
    // Para ambiente de desenvolvimento, retornamos os títulos mockados
    return mockTitles;
  } catch (error) {
    console.error("Erro ao buscar títulos financeiros:", error);
    return [];
  }
};

