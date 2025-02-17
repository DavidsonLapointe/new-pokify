
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
  const leadStatus = getLeadStatus(lead.calls.length);
  // Filtra apenas as chamadas válidas (não vazias)
  const validCalls = lead.calls.filter(call => !call.emptyLead);
  const successfulCalls = validCalls.filter(call => call.status === "success").length;
  const hasProcessed = validCalls.some(call => call.status === "success" && call.analysis);

  return (
    <TableRow key={lead.id} className="text-xs">
      <TableCell className="py-2 whitespace-nowrap">
        {getLeadName(lead)}
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        {formatDate(lead.createdAt)}
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
