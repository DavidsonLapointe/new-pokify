
import React from "react";
import { User } from "@/types/organization";
import { SuggestionsFilters } from "./SuggestionsFilters";
import { SuggestionsTable } from "./SuggestionsTable";
import { Suggestion } from "./types/suggestions";

interface SuggestionsTabContentProps {
  suggestions: Suggestion[];
  monthlySuggestionsDate: Date;
  setMonthlySuggestionsDate: (date: Date) => void;
  monthlySuggestionsSeller: string;
  setMonthlySuggestionsSeller: (seller: string) => void;
  sellers: User[];
  onUpdateStatus?: (id: string, newStatus: "pending" | "implemented" | "rejected") => void;
}

export const SuggestionsTabContent = ({
  suggestions,
  monthlySuggestionsDate,
  setMonthlySuggestionsDate,
  monthlySuggestionsSeller,
  setMonthlySuggestionsSeller,
  sellers,
  onUpdateStatus,
}: SuggestionsTabContentProps) => {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [subTypeFilter, setSubTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Extrair tipos e subtipos únicos
  const types = React.useMemo(() => {
    const uniqueTypes = new Set(suggestions.map(s => s.type));
    return Array.from(uniqueTypes);
  }, [suggestions]);

  const subTypes = React.useMemo(() => {
    const uniqueSubTypes = new Set(suggestions.map(s => s.subType));
    return Array.from(uniqueSubTypes);
  }, [suggestions]);

  // Filtrar sugestões
  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter(suggestion => {
      if (typeFilter !== "all" && suggestion.type !== typeFilter) return false;
      if (subTypeFilter !== "all" && suggestion.subType !== subTypeFilter) return false;
      if (statusFilter !== "all" && suggestion.status !== statusFilter) return false;
      return true;
    });
  }, [suggestions, typeFilter, subTypeFilter, statusFilter]);

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setTypeFilter("all");
    setSubTypeFilter("all");
    setStatusFilter("all");
    setMonthlySuggestionsSeller("all");
  };

  return (
    <div className="space-y-6">
      <SuggestionsFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        subTypeFilter={subTypeFilter}
        setSubTypeFilter={setSubTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        monthlySuggestionsDate={monthlySuggestionsDate}
        setMonthlySuggestionsDate={setMonthlySuggestionsDate}
        monthlySuggestionsSeller={monthlySuggestionsSeller}
        setMonthlySuggestionsSeller={setMonthlySuggestionsSeller}
        sellers={sellers}
        types={types}
        subTypes={subTypes}
        onClearFilters={handleClearFilters}
      />
      <SuggestionsTable 
        suggestions={filteredSuggestions}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};
