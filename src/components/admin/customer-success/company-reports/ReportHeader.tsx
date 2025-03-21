
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportType } from "./types";

interface ReportHeaderProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  title: string;
  description: string;
}

export const ReportHeader = ({ reportType, setReportType, title, description }: ReportHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-xl font-semibold text-left">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <Select
        value={reportType}
        onValueChange={(value) => {
          setReportType(value as ReportType);
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
  );
};
