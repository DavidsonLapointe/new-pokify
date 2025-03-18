
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanies } from "@/hooks/admin/prompts/useCompanies";

interface CompanySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  isVisible: boolean;
}

export const CompanySelector = ({ value, onChange, isVisible }: CompanySelectorProps) => {
  const { companies, isLoading, useMockData } = useCompanies(isVisible);

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
