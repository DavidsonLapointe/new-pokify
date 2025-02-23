
import React from "react";
import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrganizationsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const OrganizationsSearch = ({ value, onChange }: OrganizationsSearchProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
          className="pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button 
        variant="cancel"
        className="flex items-center gap-2"
        onClick={() => onChange("")}
      >
        <FilterX className="h-4 w-4" />
        Limpar Filtros
      </Button>
    </div>
  );
};
