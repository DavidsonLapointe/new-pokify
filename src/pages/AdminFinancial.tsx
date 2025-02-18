
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import { FinancialHeader } from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";
import { TitleStatus, TitleType, FinancialTitle } from "@/types/financial";

const AdminFinancial = () => {
  const [filteredTitles, setFilteredTitles] = useState<FinancialTitle[]>([]);

  const handleSearch = (filters: { 
    status: TitleStatus | "all", 
    type: TitleType | "all", 
    search: string 
  }) => {
    console.log("Filtros recebidos:", filters);

    // Simulação de dados (substitua por sua chamada API real)
    const mockTitles: FinancialTitle[] = [];

    // Aplica os filtros de forma combinada
    const filtered = mockTitles.filter(title => {
      const matchesStatus = filters.status === "all" || title.status === filters.status;
      const matchesType = filters.type === "all" || title.type === filters.type;
      const matchesSearch = filters.search === "" || 
        title.organizationName.toLowerCase().includes(filters.search.toLowerCase());

      // Retorna true apenas se TODOS os filtros ativos correspondem
      return matchesStatus && matchesType && matchesSearch;
    });

    console.log("Títulos filtrados:", filtered);
    setFilteredTitles(filtered);
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
