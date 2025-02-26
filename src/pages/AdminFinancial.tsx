import { useState } from "react";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import { FinancialHeader } from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";
import { TitleStatus, TitleType, FinancialTitle } from "@/types/financial";

const AdminFinancial = () => {
  const [filteredTitles, setFilteredTitles] = useState<FinancialTitle[]>([]);

  // Mock data for testing
  const mockTitles: FinancialTitle[] = [
    {
      id: "1",
      organizationId: "1",
      type: "mensalidade",
      value: 1000,
      dueDate: "2024-03-25",
      status: "pending",
      referenceMonth: "2024-03-01",
      createdAt: "2024-03-01",
      organization: {
        name: "Empresa A LTDA",
        nome_fantasia: "Empresa A",
        cnpj: "12.345.678/0001-90"
      }
    },
    {
      id: "2",
      organizationId: "2",
      type: "pro_rata",
      value: 500,
      dueDate: "2024-03-20",
      status: "overdue",
      createdAt: "2024-03-01",
      organization: {
        name: "Empresa B Comércio S.A.",
        nome_fantasia: "Empresa B",
        cnpj: "98.765.432/0001-10"
      }
    }
  ];

  const handleSearch = (filters: { 
    status: TitleStatus | "all", 
    type: TitleType | "all", 
    search: string 
  }) => {
    // Se todos os filtros estiverem em seu estado inicial, mostre todos os títulos
    if (filters.status === "all" && filters.type === "all" && filters.search === "") {
      setFilteredTitles(mockTitles);
      return;
    }

    // Aplica os filtros
    const filtered = mockTitles.filter(title => {
      const matchesStatus = filters.status === "all" || title.status === filters.status;
      const matchesType = filters.type === "all" || title.type === filters.type;
      
      // Busca por razão social, nome fantasia ou CNPJ
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = filters.search === "" || 
        title.organization?.name.toLowerCase().includes(searchTerm) ||
        title.organization?.nome_fantasia?.toLowerCase().includes(searchTerm) ||
        title.organization?.cnpj.toLowerCase().includes(searchTerm);

      return matchesStatus && matchesType && matchesSearch;
    });

    setFilteredTitles(filtered);
  };

  // Inicializa os títulos ao montar o componente
  useState(() => {
    setFilteredTitles(mockTitles);
  });

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">
          Gerencie os títulos financeiros das empresas
        </p>
      </div>

      <FinancialHeader />
      <FinancialFilters onSearch={handleSearch} />
      <FinancialTitlesTable titles={filteredTitles} />
    </div>
  );
};

export default AdminFinancial;
