
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OrganizationsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const OrganizationsSearch = ({ value, onChange }: OrganizationsSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
