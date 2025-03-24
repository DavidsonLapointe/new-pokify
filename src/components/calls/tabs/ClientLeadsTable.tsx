
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadCalls } from "../types";
import { LeadStatusBadge } from "../LeadStatusBadge";
import { LeadTemperatureBadge } from "../LeadTemperatureBadge";
import { AIInteractionsCount } from "../AIInteractionsCount";
import { LeadActionButtons } from "../LeadActionButtons";
import { getLeadName } from "../utils";

interface ClientLeadsTableProps {
  leads: LeadCalls[];
  formatDate: (date: string) => string;
  onEditLead: (lead: LeadCalls) => void;
}

export const ClientLeadsTable = ({ leads, formatDate, onEditLead }: ClientLeadsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] text-xs whitespace-nowrap text-left">Nome do Lead</TableHead>
            <TableHead className="w-[120px] text-xs whitespace-nowrap text-center">Data de Cadastro</TableHead>
            <TableHead className="w-[120px] text-xs whitespace-nowrap">Status</TableHead>
            <TableHead className="w-[120px] text-xs whitespace-nowrap">Temperatura do Lead</TableHead>
            <TableHead className="w-[160px] text-xs whitespace-nowrap text-center">Funil (CRM)</TableHead>
            <TableHead className="w-[160px] text-xs whitespace-nowrap text-center">Interações IA</TableHead>
            <TableHead className="w-[80px] text-xs whitespace-nowrap text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length > 0 ? (
            leads.map((lead) => {
              const hasProcessedCalls = lead.calls.some(call => call.status === "success");
              
              return (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-xs text-left">{getLeadName(lead)}</TableCell>
                  <TableCell className="text-xs text-center">{formatDate(lead.createdAt)}</TableCell>
                  <TableCell className="text-xs">
                    <LeadStatusBadge status={lead.status || "active"} />
                  </TableCell>
                  <TableCell className="text-xs">
                    <LeadTemperatureBadge calls={lead.calls} hasProcessed={hasProcessedCalls} />
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    {lead.crmInfo ? (
                      <div className="text-xs space-y-1 flex flex-col items-center">
                        <div className="text-[11px] text-gray-700">{lead.crmInfo.funnel}</div>
                        <div className="text-[10px] text-gray-500">{lead.crmInfo.stage}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Não integrado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    <AIInteractionsCount 
                      calls={lead.calls} 
                      lead={lead} 
                      formatDate={formatDate}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <LeadActionButtons lead={lead} onEditLead={onEditLead} />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
