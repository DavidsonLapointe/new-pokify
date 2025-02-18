
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import { FinancialHeader } from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";
import { TitleStatus, TitleType } from "@/types/financial";

const AdminFinancial = () => {
  const handleSearch = (filters: { 
    status: TitleStatus | "all", 
    type: TitleType | "all", 
    search: string 
  }) => {
    console.log("Aplicando filtros:", filters);
    // Aqui você implementará a lógica de filtro quando integrar com o backend
    // Por enquanto, apenas logamos os filtros para debug
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <FinancialHeader />
        <FinancialFilters onSearch={handleSearch} />
        <FinancialTitlesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminFinancial;
