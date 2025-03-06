
import { useState } from "react";
import { TitleStatus, TitleType } from "@/types/financial";
import { FilterFields } from "./filters/FilterFields";
import { FilterButtons } from "./filters/FilterButtons";

interface FinancialFiltersProps {
  onSearch: (filters: { status: TitleStatus | "all", type: TitleType | "all", search: string }) => void;
}

export const FinancialFilters = ({ onSearch }: FinancialFiltersProps) => {
  const [status, setStatus] = useState<TitleStatus | "all">("all");
  const [type, setType] = useState<TitleType | "all">("all");
  const [search, setSearch] = useState("");

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
    <div className="flex flex-col sm:flex-row gap-4">
      <FilterFields 
        status={status}
        type={type}
        search={search}
        onStatusChange={setStatus}
        onTypeChange={setType}
        onSearchChange={setSearch}
      />
      
      <div className="flex gap-2">
        <FilterButtons
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />
      </div>
    </div>
  );
};
