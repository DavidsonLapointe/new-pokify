
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { LeadCalls } from "../types";
import { LeadTemperatureBadge } from "../LeadTemperatureBadge";
import { LeadStatusBadge } from "../LeadStatusBadge";
import { LeadCRMInfo } from "../LeadCRMInfo";
import { LeadActionButtons } from "../LeadActionButtons";
import { getLeadName } from "../utils";
import { AIInteractionsDisplay } from "../AIInteractionsDisplay";

interface LeadsTableRowProps {
  lead: LeadCalls;
  formatDate: (date: string) => string;
  onEditLead: (lead: LeadCalls) => void;
}

export const LeadsTableRow = ({
  lead,
  formatDate,
  onEditLead
}: LeadsTableRowProps) => {
  // Todas as chamadas são válidas para contagem
  const totalCalls = lead.calls.length;
  const successfulCalls = lead.calls.filter(call => call.status === "success").length;
  const hasProcessed = lead.calls.some(call => call.status === "success" && call.analysis);

  return (
    <TableRow key={lead.id} className="text-xs">
      <TableCell className="py-2 whitespace-nowrap">
        {getLeadName(lead)}
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        {formatDate(lead.createdAt).split(',')[0]}
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <LeadStatusBadge status={lead.status} />
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <LeadTemperatureBadge 
          calls={lead.calls} 
          hasProcessed={hasProcessed} 
        />
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <LeadCRMInfo 
          successfulCalls={successfulCalls}
          crmInfo={lead.crmInfo}
        />
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <AIInteractionsDisplay lead={lead} />
      </TableCell>
      <TableCell className="py-2">
        <LeadActionButtons
          lead={lead}
          onEditLead={onEditLead}
        />
      </TableCell>
    </TableRow>
  );
};
