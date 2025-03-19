
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
    <div className="flex gap-2 items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
          className="pl-9 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};
