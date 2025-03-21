
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterX, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export const LeadsFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: LeadsFilterProps) => {
  // Debounce search input to avoid excessive re-renders
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearchChange]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome ou empresa..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <Select
          value={statusFilter}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="contactar">Contactar</SelectItem>
            <SelectItem value="qualificacao">Qualificação</SelectItem>
            <SelectItem value="nutricao_mkt">Nutrição Mkt</SelectItem>
            <SelectItem value="email_onboarding">Email Onboarding</SelectItem>
            <SelectItem value="ganho">Ganho</SelectItem>
            <SelectItem value="perda">Perda</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="cancel"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <FilterX className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};
