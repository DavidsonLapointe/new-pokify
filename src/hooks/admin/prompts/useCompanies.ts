
import { useState, useEffect } from "react";
import { CompanyLeadly } from "@/types/company-leadly";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Mock company data for testing
const mockCompanies: CompanyLeadly[] = [
  {
    id: "1",
    razao_social: "Empresa Teste S.A.",
    nome_fantasia: "Empresa Teste",
    cnpj: "12.345.678/0001-90",
    email: "contato@empresateste.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    razao_social: "Comércio Digital LTDA",
    nome_fantasia: "ComDig",
    cnpj: "98.765.432/0001-21",
    email: "contato@comdig.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    razao_social: "Soluções Integradas Brasil S.A.",
    nome_fantasia: "SIB Tecnologia",
    cnpj: "45.678.901/0001-23",
    email: "contato@sibtec.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    razao_social: "Indústria Nova Era LTDA",
    nome_fantasia: "Nova Era",
    cnpj: "34.567.890/0001-45",
    email: "contato@novaera.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    razao_social: "Tecnologia Avançada S.A.",
    nome_fantasia: "TecAv",
    cnpj: "23.456.789/0001-67",
    email: "contato@tecav.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useCompanies = (shouldFetch: boolean = true) => {
  const [companies, setCompanies] = useState<CompanyLeadly[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('company_leadly')
        .select('*')
        .order('nome_fantasia', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCompanies(data);
        setUseMockData(false);
      } else {
        // If no data from Supabase, use mock data
        setCompanies(mockCompanies);
        setUseMockData(true);
        console.log("Usando dados mockados para empresas");
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      // Fall back to mock data on error
      setCompanies(mockCompanies);
      setUseMockData(true);
      console.log("Erro ao buscar empresas, usando dados mockados");
      
      toast({
        title: "Aviso",
        description: "Usando dados de exemplo para empresas.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchCompanies();
    }
  }, [shouldFetch]);

  return {
    companies,
    isLoading,
    useMockData,
    fetchCompanies
  };
};
