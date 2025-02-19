
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
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
      organizationId: 1,
      organizationName: "Empresa A LTDA",
      organizationNomeFantasia: "Empresa A",
      organizationCNPJ: "12.345.678/0001-90",
      type: "mensalidade",
      value: 1000,
      amount: 1000,
      description: "Mensalidade Plano Professional",
      dueDate: "2024-03-25",
      status: "pending",
      referenceMonth: "2024-03-01",
      createdAt: "2024-03-01",
    },
    {
      id: "2",
      organizationId: 2,
      organizationName: "Empresa B Comércio S.A.",
      organizationNomeFantasia: "Empresa B",
      organizationCNPJ: "98.765.432/0001-10",
      type: "pro_rata",
      value: 500,
      amount: 500,
      description: "Pro Rata Plano Professional",
      dueDate: "2024-03-20",
      status: "overdue",
      createdAt: "2024-03-01",
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
        title.organizationName.toLowerCase().includes(searchTerm) ||
        title.organizationNomeFantasia?.toLowerCase().includes(searchTerm) ||
        title.organizationCNPJ?.toLowerCase().includes(searchTerm);

      return matchesStatus && matchesType && matchesSearch;
    });

    setFilteredTitles(filtered);
  };

  // Initialize titles when component mounts
  useState(() => {
    setFilteredTitles(mockTitles);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <FinancialHeader />
        <FinancialFilters onSearch={handleSearch} />
        <FinancialTitlesTable 
          titles={filteredTitles}
          organization={{
            id: 1,
            name: "Organization",
            nomeFantasia: "Organization Ltda",
            status: "active",
            plan: "professional",
            users: [],
            pendingReason: null,
            integratedCRM: null,
            integratedLLM: null,
            email: "contact@organization.com",
            phone: "(11) 1234-5678",
            cnpj: "12.345.678/0001-90",
            adminName: "John Doe",
            adminEmail: "john@organization.com",
            createdAt: new Date().toISOString(),
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminFinancial;
