
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, LayoutDashboard } from "lucide-react";
import { ReportType, CompanyData } from "./types";

interface ReportTableProps {
  reportType: ReportType;
  companies: CompanyData[];
}

export const ReportTable = ({ reportType, companies }: ReportTableProps) => {
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
      return companies.map((company, index) => (
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
      return companies.map((company, index) => (
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
    
    return companies.map((company, index) => (
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
  );
};
