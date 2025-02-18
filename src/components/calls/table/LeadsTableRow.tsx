
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
  // Todas as chamadas são válidas para contagem
  const totalCalls = lead.calls.length;
  const successfulCalls = lead.calls.filter(call => call.status === "success").length;
  const hasProcessed = lead.calls.some(call => call.status === "success" && call.analysis);
  const leadStatus = getLeadStatus(lead);

  console.log("Lead:", lead.id, "Total calls:", totalCalls, "Calls array:", lead.calls); // Debug log mais detalhado

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
          calls={lead.calls} 
          hasProcessed={hasProcessed} 
        />
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap text-center">
        <Button
          variant="link"
          onClick={() => onShowHistory(lead)}
          className="p-0 h-auto font-medium text-[#7E69AB] hover:text-[#9b87f5]"
        >
          {totalCalls}
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
