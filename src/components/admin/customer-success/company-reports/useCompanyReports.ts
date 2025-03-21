
import { useState, useMemo } from "react";
import { ReportType, CompanyData } from "./types";
import { generateMockData } from "./mockData";

export const useCompanyReports = () => {
  const [reportType, setReportType] = useState<ReportType>("ai-executions");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const allCompanies = useMemo(() => generateMockData(), []);
  
  // Order companies based on the report type
  const companies = useMemo(() => {
    switch (reportType) {
      case "ai-executions":
        // Order by interactions (AI executions) in descending order
        return [...allCompanies].sort((a, b) => b.interactions - a.interactions);
      case "ai-tools":
        // Order by module count in descending order
        return [...allCompanies].sort((a, b) => b.modules.count - a.modules.count);
      case "unused-permissions":
        // Order by unused permissions count in descending order
        return [...allCompanies]
          .filter(company => (company.unusedPermissions?.count || 0) > 0)
          .sort((a, b) => (b.unusedPermissions?.count || 0) - (a.unusedPermissions?.count || 0));
      default:
        return allCompanies;
    }
  }, [reportType, allCompanies]);
  
  // Pagination calculations
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = companies.slice(startIndex, endIndex);

  // Report title based on type
  const getReportTitle = () => {
    switch (reportType) {
      case "ai-executions":
        return "Execuções de IA por Empresa";
      case "ai-tools":
        return "Ferramentas de IA contratadas por Empresa";
      case "unused-permissions":
        return "Empresas com funções/abas sem usuários";
      default:
        return "Empresas com Maior Atividade";
    }
  };

  // Report description based on type
  const getReportDescription = () => {
    switch (reportType) {
      case "ai-executions":
        return "Ranking do número de execuções de IA por empresa.";
      case "ai-tools":
        return "Quantidade de ferramentas de IA contratadas por empresa.";
      case "unused-permissions":
        return "Empresas com funções ou abas sem usuários ativos vinculados.";
      default:
        return "";
    }
  };

  // Reset pagination when report type changes
  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
    setCurrentPage(1);
  };

  return {
    reportType,
    setReportType: handleReportTypeChange,
    currentPage,
    setCurrentPage,
    totalPages,
    currentCompanies,
    getReportTitle,
    getReportDescription
  };
};
