
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface CompanySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  isVisible: boolean;
}

export const CompanySelector = ({ value, onChange, isVisible }: CompanySelectorProps) => {
  const [companies, setCompanies] = useState<CompanyLeadly[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible) {
      fetchCompanies();
    }
  }, [isVisible]);

  const fetchCompanies = async () => {
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

  if (!isVisible) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Empresa
      </label>
      {useMockData && (
        <div className="text-xs text-muted-foreground mb-2">
          Exibindo dados de exemplo para demonstração
        </div>
      )}
      <Select 
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.nome_fantasia || company.razao_social}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
