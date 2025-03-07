
import { useEffect } from "react";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import { FinancialHeader } from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";
import { useFinancialFilters } from "@/components/admin/financial/hooks/useFinancialFilters";
import { getAllTitles } from "@/services/financial";
import { useQuery } from "@tanstack/react-query";

const AdminFinancial = () => {
  // Use React Query to fetch titles
  const { data: fetchedTitles, isLoading } = useQuery({
    queryKey: ['financial-titles'],
    queryFn: getAllTitles
  });

  // Use our custom hook for filtering
  const { filteredTitles, filters, applyFilters, clearFilters } = useFinancialFilters(fetchedTitles || []);

  // Garantir que os títulos sejam exibidos no carregamento inicial
  useEffect(() => {
    if (fetchedTitles && fetchedTitles.length > 0) {
      // Inicializar com todos os títulos, sem aplicar filtros
      applyFilters({ status: "all", type: "all", search: "" }, false);
    }
  }, [fetchedTitles, applyFilters]);

  const handleSearch = (filters: { 
    status: "pending" | "paid" | "overdue" | "all", 
    type: "pro_rata" | "mensalidade" | "all", 
    search: string 
  }) => {
    applyFilters(filters);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FinancialHeader />
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FinancialHeader />
      <FinancialFilters onSearch={handleSearch} initialFilters={filters} />
      <FinancialTitlesTable titles={filteredTitles} />
    </div>
  );
};

export default AdminFinancial;
