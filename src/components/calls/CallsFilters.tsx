
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useEffect } from "react";

interface CallsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const CallsFilters = ({
  searchQuery,
  onSearchChange,
}: CallsFiltersProps) => {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  // Efeito para fazer debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Atualiza a busca após 300ms de inatividade na digitação
      onSearchChange(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, onSearchChange]);

  return (
    <div className="mb-6">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 max-w-lg">
          <Input
            placeholder="Buscar por nome, telefone, CPF/CNPJ ou email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button 
          variant="cancel"
          className="flex items-center gap-2"
          onClick={handleClearSearch}
        >
          <FilterX className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

