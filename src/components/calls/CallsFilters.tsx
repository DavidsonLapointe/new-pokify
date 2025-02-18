
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

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

  const handleSearch = () => {
    // Trigger search - currently just a visual feedback since search is real-time
    console.log("Search button clicked with query:", searchQuery);
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 max-w-lg">
          <Input
            placeholder="Buscar por nome, telefone, CPF/CNPJ ou email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSearch}
          className="shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
