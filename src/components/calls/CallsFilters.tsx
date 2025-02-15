
import { Input } from "@/components/ui/input";

interface CallsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const CallsFilters = ({
  searchQuery,
  onSearchChange,
}: CallsFiltersProps) => {
  return (
    <div className="mb-6">
      <Input
        placeholder="Buscar por nome, telefone, CPF/CNPJ ou email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-lg"
      />
    </div>
  );
};
