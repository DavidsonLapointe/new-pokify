
import { Button } from "@/components/ui/button";
import { FilterX, Search } from "lucide-react";

interface FilterButtonsProps {
  onSearch: () => void;
  onClear: () => void;
}

export const FilterButtons = ({ onSearch, onClear }: FilterButtonsProps) => {
  return (
    <>
      <Button 
        variant="default"
        onClick={onSearch}
        className="flex items-center gap-2 whitespace-nowrap"
        size="default"
      >
        <Search className="h-4 w-4" />
        Buscar
      </Button>
      <Button 
        variant="cancel" 
        className="flex items-center gap-2 whitespace-nowrap"
        onClick={onClear}
        size="default"
      >
        <FilterX className="h-4 w-4" />
        Limpar Filtros
      </Button>
    </>
  );
};
