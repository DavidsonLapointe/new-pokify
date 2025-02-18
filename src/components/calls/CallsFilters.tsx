
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

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
          variant="outline" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleClearSearch}
        >
          <FilterX className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};
