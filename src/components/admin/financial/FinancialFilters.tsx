
import { useState, useEffect } from "react";
import { TitleStatus, TitleType } from "@/types/financial";
import { FilterFields } from "./filters/FilterFields";
import { FilterButtons } from "./filters/FilterButtons";

interface FinancialFiltersProps {
  onSearch: (filters: { status: TitleStatus | "all", type: TitleType | "all", search: string }) => void;
  initialFilters?: { status: TitleStatus | "all", type: TitleType | "all", search: string };
}

export const FinancialFilters = ({ onSearch, initialFilters }: FinancialFiltersProps) => {
  const [status, setStatus] = useState<TitleStatus | "all">("all");
  const [type, setType] = useState<TitleType | "all">("all");
  const [search, setSearch] = useState("");

  // Atualiza os estados com os filtros iniciais, se fornecidos
  useEffect(() => {
    if (initialFilters) {
      setStatus(initialFilters.status);
      setType(initialFilters.type);
      setSearch(initialFilters.search);
    }
  }, [initialFilters]);

  const handleSearch = () => {
    onSearch({ status, type, search });
  };

  const handleClearFilters = () => {
    setStatus("all");
    setType("all");
    setSearch("");
    onSearch({ status: "all", type: "all", search: "" });
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-1">
        <FilterFields 
          status={status}
          type={type}
          search={search}
          onStatusChange={setStatus}
          onTypeChange={setType}
          onSearchChange={setSearch}
        />
      </div>
      
      <div className="flex gap-2 sm:self-end">
        <FilterButtons
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />
      </div>
    </div>
  );
};
