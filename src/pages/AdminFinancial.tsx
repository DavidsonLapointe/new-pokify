
import { useEffect, useState } from "react";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import { FinancialHeader } from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";
import { FinancialTitle } from "@/types/financial";
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
  const { filteredTitles, applyFilters, clearFilters } = useFinancialFilters(fetchedTitles || []);

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
      <FinancialFilters onSearch={handleSearch} />
      <FinancialTitlesTable titles={filteredTitles} />
    </div>
  );
};

export default AdminFinancial;
