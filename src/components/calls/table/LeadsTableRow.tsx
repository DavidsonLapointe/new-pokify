
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { LeadCalls } from "../types";
import { LeadTemperatureBadge } from "../LeadTemperatureBadge";
import { LeadStatusBadge } from "../LeadStatusBadge";
import { LeadCRMInfo } from "../LeadCRMInfo";
import { LeadActionButtons } from "../LeadActionButtons";
import { getLeadName, getLeadStatus } from "../utils";

interface LeadsTableRowProps {
  lead: LeadCalls;
  formatDate: (date: string) => string;
  onShowHistory: (lead: LeadCalls) => void;
  onShowUpload: (lead: LeadCalls) => void;
}

export const LeadsTableRow = ({
  lead,
  formatDate,
  onShowHistory,
  onShowUpload
}: LeadsTableRowProps) => {
  // Remove o filtro de emptyLead pois todas as chamadas são válidas neste contexto
  const validCalls = lead.calls;
  const successfulCalls = validCalls.filter(call => call.status === "success").length;
  const hasProcessed = validCalls.some(call => call.status === "success" && call.analysis);
  const leadStatus = getLeadStatus(lead);

  console.log("Lead calls:", lead.calls.length); // Debug log

  return (
    <TableRow key={lead.id} className="text-xs">
      <TableCell className="py-2 whitespace-nowrap">
        {getLeadName(lead)}
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        {formatDate(lead.createdAt).split(',')[0]}
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <LeadStatusBadge status={leadStatus} />
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <LeadTemperatureBadge 
          calls={validCalls} 
          hasProcessed={hasProcessed} 
        />
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <Button
          variant="link"
          onClick={() => onShowHistory(lead)}
          className="p-0 h-auto font-medium"
        >
          {validCalls.length}
        </Button>
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        <LeadCRMInfo 
          successfulCalls={successfulCalls}
          crmInfo={lead.crmInfo}
        />
      </TableCell>
      <TableCell className="py-2">
        <LeadActionButtons
          lead={lead}
          onShowHistory={onShowHistory}
          onShowUpload={onShowUpload}
        />
      </TableCell>
    </TableRow>
  );
};
