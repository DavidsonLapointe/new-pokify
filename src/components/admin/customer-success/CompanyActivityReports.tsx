
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, ShieldAlert, LayoutDashboard } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

type ReportType = "ai-executions" | "ai-tools" | "unused-permissions";

interface CompanyData {
  name: string;
  activeUsers: number;
  interactions: number;
  modules: {
    count: number;
    names: string[];
  };
  lastActivity: string;
  unusedPermissions?: {
    count: number;
    tabs: string[];
    functions: string[];
  };
}

// Mock data generator with 15 companies
const generateMockData = (): CompanyData[] => {
  const companies = [
    { 
      name: "TechSolutions Brasil", 
      activeUsers: 24, 
      interactions: 187, 
      modules: { 
        count: 4, 
        names: ["CRM Avançado", "Dashboard Analítico", "Gestão de Leads", "Automação de Marketing"] 
      },
      lastActivity: "Hoje",
      unusedPermissions: {
        count: 3,
        tabs: ["Dashboard Financeiro", "Relatórios de Vendas"],
        functions: ["Exportar para Excel"]
      }
    },
    { 
      name: "GloboTech", 
      activeUsers: 18, 
      interactions: 143, 
      modules: { 
        count: 3, 
        names: ["CRM Avançado", "Gestão de Leads", "Dashboard Analítico"] 
      },
      lastActivity: "Hoje",
      unusedPermissions: {
        count: 2,
        tabs: ["Análise de Dados"],
        functions: ["Configurações Avançadas"]
      }
    },
    { 
      name: "Conecta Software", 
      activeUsers: 15, 
      interactions: 112, 
      modules: { 
        count: 3, 
        names: ["Automação de Marketing", "Gestão de Leads", "Integração de APIs"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 4,
        tabs: ["Dashboard Analítico", "Relatórios Personalizados"],
        functions: ["Exportar para CSV", "Enviar por Email"]
      }
    },
    { 
      name: "Sistemas Integrados SA", 
      activeUsers: 12, 
      interactions: 98, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Gestão de Leads"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 1,
        tabs: [],
        functions: ["Configurações Avançadas"]
      }
    },
    { 
      name: "DataSoft", 
      activeUsers: 10, 
      interactions: 87, 
      modules: { 
        count: 3, 
        names: ["Dashboard Analítico", "CRM Básico", "Gestão de Projeto"] 
      },
      lastActivity: "Há 2 dias",
      unusedPermissions: {
        count: 5,
        tabs: ["Gestão de Equipes", "Análise de Desempenho", "Dashboard Avançado"],
        functions: ["Importação em Massa", "Exportar Relatórios"]
      }
    },
    { 
      name: "NeoTech", 
      activeUsers: 8, 
      interactions: 76, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Automação de Marketing"] 
      },
      lastActivity: "Há 3 dias",
      unusedPermissions: {
        count: 2,
        tabs: ["Análise de Campanhas"],
        functions: ["Configuração de Automações"]
      }
    },
    { 
      name: "ByteCode Systems", 
      activeUsers: 7, 
      interactions: 62, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 3 dias",
      unusedPermissions: {
        count: 0,
        tabs: [],
        functions: []
      }
    },
    { 
      name: "Inovação Digital", 
      activeUsers: 6, 
      interactions: 54, 
      modules: { 
        count: 2, 
        names: ["Gestão de Leads", "Dashboard Básico"] 
      },
      lastActivity: "Há 4 dias",
      unusedPermissions: {
        count: 3,
        tabs: ["Automação de Marketing", "Relatórios Personalizados"],
        functions: ["Acesso a API"]
      }
    },
    { 
      name: "TecnoPro Soluções", 
      activeUsers: 16, 
      interactions: 123, 
      modules: { 
        count: 3, 
        names: ["CRM Avançado", "Dashboard Analítico", "Gestão de Vendas"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 2,
        tabs: ["Integração com ERPs"],
        functions: ["Configurações de Sistema"]
      }
    },
    { 
      name: "Nexus IT", 
      activeUsers: 14, 
      interactions: 105, 
      modules: { 
        count: 2, 
        names: ["Automação de Vendas", "CRM Avançado"] 
      },
      lastActivity: "Hoje",
      unusedPermissions: {
        count: 4,
        tabs: ["Gestão de Dados", "Relatórios Avançados"],
        functions: ["Exportação Avançada", "Configurações Administrativas"]
      }
    },
    { 
      name: "Alpha Tecnologia", 
      activeUsers: 9, 
      interactions: 82, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Integração de Leads"] 
      },
      lastActivity: "Há 2 dias",
      unusedPermissions: {
        count: 1,
        tabs: ["Análise de Desempenho"],
        functions: []
      }
    },
    { 
      name: "Digitel Sistemas", 
      activeUsers: 11, 
      interactions: 94, 
      modules: { 
        count: 3, 
        names: ["Automação de Marketing", "Dashboard Analítico", "CRM Básico"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 3,
        tabs: ["CRM Avançado"],
        functions: ["Gestão de Usuários", "Configurações de Email"]
      }
    },
    { 
      name: "SoftWay Brasil", 
      activeUsers: 5, 
      interactions: 48, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 5 dias",
      unusedPermissions: {
        count: 2,
        tabs: ["Dashboard Básico"],
        functions: ["Configurações de Notificações"]
      }
    },
    { 
      name: "Conexão Digital", 
      activeUsers: 4, 
      interactions: 42, 
      modules: { 
        count: 1, 
        names: ["Gestão de Leads"] 
      },
      lastActivity: "Há 5 dias",
      unusedPermissions: {
        count: 0,
        tabs: [],
        functions: []
      }
    },
    { 
      name: "DataCore Brasil", 
      activeUsers: 3, 
      interactions: 35, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 6 dias",
      unusedPermissions: {
        count: 1,
        tabs: [],
        functions: ["Exportar Contatos"]
      }
    }
  ];
  
  return companies;
};

export const CompanyActivityReports = () => {
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

  // Pagination calculations
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = companies.slice(startIndex, endIndex);

  // Function to generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Render table header based on report type
  const renderTableHeader = () => {
    if (reportType === "ai-tools") {
      return (
        <tr className="border-b">
          <th className="text-left py-3 px-4">Empresa</th>
          <th className="text-center py-3 px-4">Módulos (qtde)</th>
        </tr>
      );
    }
    
    if (reportType === "unused-permissions") {
      return (
        <tr className="border-b">
          <th className="text-left py-3 px-4">Empresa</th>
          <th className="text-center py-3 px-4">Qtde de funções sem usuários</th>
        </tr>
      );
    }
    
    return (
      <tr className="border-b">
        <th className="text-left py-3 px-4">Empresa</th>
        <th className="text-center py-3 px-4">Execuções IA</th>
        <th className="text-center py-3 px-4">Usuários Ativos</th>
        <th className="text-center py-3 px-4">Módulos</th>
        <th className="text-center py-3 px-4">Última Atividade</th>
      </tr>
    );
  };

  // Render table rows based on report type
  const renderTableRows = () => {
    if (reportType === "ai-tools") {
      return currentCompanies.map((company, index) => (
        <tr key={index} className="border-b hover:bg-muted/50">
          <td className="py-3 px-4 text-left">{company.name}</td>
          <td className="py-3 px-4 text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">{company.modules.count}</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Módulos contratados:</p>
                    <ul className="list-disc list-inside">
                      {company.modules.names.map((name, idx) => (
                        <li key={idx}>{name}</li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </td>
        </tr>
      ));
    }
    
    if (reportType === "unused-permissions") {
      return currentCompanies.map((company, index) => (
        <tr key={index} className="border-b hover:bg-muted/50">
          <td className="py-3 px-4 text-left">{company.name}</td>
          <td className="py-3 px-4 text-center">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">{company.unusedPermissions?.count || 0}</span>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="center" 
                  sideOffset={-5}
                  className="max-w-[300px] text-sm"
                >
                  <div className="space-y-2">
                    <p className="font-medium">Funções/abas sem usuários:</p>
                    
                    {company.unusedPermissions?.functions.length ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-blue-700">Funções:</p>
                        <div className="flex flex-wrap gap-1">
                          {company.unusedPermissions?.functions.map((name, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    
                    {company.unusedPermissions?.tabs.length ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-purple-700">Abas:</p>
                        <div className="flex flex-wrap gap-1">
                          {company.unusedPermissions?.tabs.map((name, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    
                    {(!company.unusedPermissions?.functions.length && !company.unusedPermissions?.tabs.length) && (
                      <p>Não há informações detalhadas disponíveis.</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </td>
        </tr>
      ));
    }
    
    return currentCompanies.map((company, index) => (
      <tr key={index} className="border-b hover:bg-muted/50">
        <td className="py-3 px-4 text-left">{company.name}</td>
        <td className="py-3 px-4 text-center">{company.interactions}</td>
        <td className="py-3 px-4 text-center">{company.activeUsers}</td>
        <td className="py-3 px-4 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{company.modules.count}</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Módulos contratados:</p>
                  <ul className="list-disc list-inside">
                    {company.modules.names.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </td>
        <td className="py-3 px-4 text-center">{company.lastActivity}</td>
      </tr>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-left">{getReportTitle()}</h3>
          <p className="text-sm text-muted-foreground">{getReportDescription()}</p>
        </div>
        
        <Select
          value={reportType}
          onValueChange={(value) => {
            setReportType(value as ReportType);
            setCurrentPage(1); // Reset to first page when changing report type
          }}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Selecione o tipo de relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai-executions">Execuções de IA por Empresa</SelectItem>
            <SelectItem value="ai-tools">Ferramentas de IA contratadas por Empresa</SelectItem>
            <SelectItem value="unused-permissions">Empresas com funções/abas sem usuários</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {renderTableHeader()}
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(1)} 
                />
              </PaginationItem>
            )}
            
            {renderPaginationItems()}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(totalPages)} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
