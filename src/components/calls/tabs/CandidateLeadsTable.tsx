
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadCalls } from "../types";
import { LeadStatusBadge } from "../LeadStatusBadge";
import { AIInteractionsCount } from "../AIInteractionsCount";
import { LeadActionButtons } from "../LeadActionButtons";
import { getLeadName } from "../utils";

interface CandidateLeadsTableProps {
  leads: LeadCalls[];
  formatDate: (date: string) => string;
  onEditLead: (lead: LeadCalls) => void;
}

export const CandidateLeadsTable = ({ leads, formatDate, onEditLead }: CandidateLeadsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] text-xs whitespace-nowrap">Nome do Lead</TableHead>
            <TableHead className="w-[120px] text-xs whitespace-nowrap">Data de Cadastro</TableHead>
            <TableHead className="w-[120px] text-xs whitespace-nowrap">Status</TableHead>
            <TableHead className="w-[160px] text-xs whitespace-nowrap">Interações IA</TableHead>
            <TableHead className="w-[80px] text-xs whitespace-nowrap text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium text-xs">{getLeadName(lead)}</TableCell>
                <TableCell className="text-xs">{formatDate(lead.createdAt)}</TableCell>
                <TableCell className="text-xs">
                  <LeadStatusBadge status={lead.status || "active"} />
                </TableCell>
                <TableCell className="text-xs">
                  <AIInteractionsCount calls={lead.calls} />
                </TableCell>
                <TableCell className="text-center">
                  <LeadActionButtons lead={lead} onEditLead={onEditLead} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum candidato encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
