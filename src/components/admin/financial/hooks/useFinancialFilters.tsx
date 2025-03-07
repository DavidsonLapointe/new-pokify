
import { useState, useCallback } from "react";
import { TitleStatus, TitleType, FinancialTitle } from "@/types/financial";
import { useToast } from "@/hooks/use-toast";

export interface FinancialFilters {
  status: TitleStatus | "all";
  type: TitleType | "all";
  search: string;
}

export const useFinancialFilters = (allTitles: FinancialTitle[]) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FinancialFilters>({
    status: "all",
    type: "all",
    search: ""
  });
  const [filteredTitles, setFilteredTitles] = useState<FinancialTitle[]>(allTitles);

  const applyFilters = useCallback((newFilters: FinancialFilters, showToast = true) => {
    setFilters(newFilters);
    
    // Se todos os filtros estiverem em seu estado inicial, mostre todos os títulos
    if (newFilters.status === "all" && newFilters.type === "all" && newFilters.search === "") {
      setFilteredTitles(allTitles);
      
      if (showToast) {
        toast({
          title: "Filtros limpos",
          description: "Todos os filtros foram removidos.",
        });
      }
      return;
    }

    // Aplica os filtros
    const filtered = allTitles.filter(title => {
      const matchesStatus = newFilters.status === "all" || title.status === newFilters.status;
      const matchesType = newFilters.type === "all" || title.type === newFilters.type;
      
      // Busca por razão social, nome fantasia ou CNPJ
      const searchTerm = newFilters.search.toLowerCase();
      const matchesSearch = newFilters.search === "" || 
        title.organization?.name.toLowerCase().includes(searchTerm) ||
        title.organization?.nome_fantasia?.toLowerCase().includes(searchTerm) ||
        title.organization?.cnpj.toLowerCase().includes(searchTerm);

      return matchesStatus && matchesType && matchesSearch;
    });

    setFilteredTitles(filtered);
    
    if (showToast) {
      toast({
        title: "Filtros aplicados",
        description: "A lista foi atualizada com os filtros selecionados.",
      });
    }
  }, [allTitles, toast]);

  const clearFilters = useCallback(() => {
    const resetFilters = { status: "all" as const, type: "all" as const, search: "" };
    setFilters(resetFilters);
    setFilteredTitles(allTitles);
    
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  }, [allTitles, toast]);

  return {
    filters,
    filteredTitles,
    applyFilters,
    clearFilters
  };
};
