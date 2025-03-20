
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

type ReportType = "ai-executions" | "user-activity" | "module-usage";

interface CompanyData {
  name: string;
  activeUsers: number;
  interactions: number;
  modules: {
    count: number;
    names: string[];
  };
  lastActivity: string;
}

// Mock data generator
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
      lastActivity: "Hoje" 
    },
    { 
      name: "GloboTech", 
      activeUsers: 18, 
      interactions: 143, 
      modules: { 
        count: 3, 
        names: ["CRM Avançado", "Gestão de Leads", "Dashboard Analítico"] 
      },
      lastActivity: "Hoje" 
    },
    { 
      name: "Conecta Software", 
      activeUsers: 15, 
      interactions: 112, 
      modules: { 
        count: 3, 
        names: ["Automação de Marketing", "Gestão de Leads", "Integração de APIs"] 
      },
      lastActivity: "Ontem" 
    },
    { 
      name: "Sistemas Integrados SA", 
      activeUsers: 12, 
      interactions: 98, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Gestão de Leads"] 
      },
      lastActivity: "Ontem" 
    },
    { 
      name: "DataSoft", 
      activeUsers: 10, 
      interactions: 87, 
      modules: { 
        count: 3, 
        names: ["Dashboard Analítico", "CRM Básico", "Gestão de Projeto"] 
      },
      lastActivity: "Há 2 dias" 
    },
    { 
      name: "NeoTech", 
      activeUsers: 8, 
      interactions: 76, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Automação de Marketing"] 
      },
      lastActivity: "Há 3 dias" 
    },
    { 
      name: "ByteCode Systems", 
      activeUsers: 7, 
      interactions: 62, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 3 dias" 
    },
    { 
      name: "Inovação Digital", 
      activeUsers: 6, 
      interactions: 54, 
      modules: { 
        count: 2, 
        names: ["Gestão de Leads", "Dashboard Básico"] 
      },
      lastActivity: "Há 4 dias" 
    }
  ];
  
  return companies;
};

export const CompanyActivityReports = () => {
  const [reportType, setReportType] = useState<ReportType>("ai-executions");
  const allCompanies = useMemo(() => generateMockData(), []);
  
  // Order companies based on the report type
  const companies = useMemo(() => {
    switch (reportType) {
      case "ai-executions":
        // Order by interactions (AI executions) in descending order
        return [...allCompanies].sort((a, b) => b.interactions - a.interactions);
      case "user-activity":
        // Order by active users in descending order
        return [...allCompanies].sort((a, b) => b.activeUsers - a.activeUsers);
      case "module-usage":
        // Order by module count in descending order
        return [...allCompanies].sort((a, b) => b.modules.count - a.modules.count);
      default:
        return allCompanies;
    }
  }, [reportType, allCompanies]);
  
  // Report title based on type
  const getReportTitle = () => {
    switch (reportType) {
      case "ai-executions":
        return "Execuções de IA por Empresa";
      case "user-activity":
        return "Usuários Ativos por Empresa";
      case "module-usage":
        return "Módulos Contratados por Empresa";
      default:
        return "Empresas com Maior Atividade";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold">{getReportTitle()}</h3>
        
        <Select
          value={reportType}
          onValueChange={(value) => setReportType(value as ReportType)}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Selecione o tipo de relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai-executions">Execuções de IA por Empresa</SelectItem>
            <SelectItem value="user-activity">Usuários Ativos por Empresa</SelectItem>
            <SelectItem value="module-usage">Módulos Contratados por Empresa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Empresa</th>
              <th className="text-left py-3 px-4">Usuários Ativos</th>
              <th className="text-left py-3 px-4">Execuções IA</th>
              <th className="text-left py-3 px-4">Módulos</th>
              <th className="text-left py-3 px-4">Última Atividade</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">{company.name}</td>
                <td className="py-3 px-4">{company.activeUsers}</td>
                <td className="py-3 px-4">{company.interactions}</td>
                <td className="py-3 px-4">
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
                <td className="py-3 px-4">{company.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
