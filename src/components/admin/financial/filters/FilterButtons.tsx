
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
        className="flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        Buscar
      </Button>
      <Button 
        variant="cancel" 
        className="flex items-center gap-2"
        onClick={onClear}
      >
        <FilterX className="h-4 w-4" />
        Limpar Filtros
      </Button>
    </>
  );
};
