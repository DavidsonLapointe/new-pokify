
import { TableCell, TableRow } from "@/components/ui/table";
import { LeadCalls } from "../types";
import { LeadActionButtons } from "../LeadActionButtons";
import { LeadTemperatureBadge } from "../LeadTemperatureBadge";
import { LeadStatusBadge } from "../LeadStatusBadge";
import { AIInteractionsCount } from "../AIInteractionsCount";
import { getLeadName } from "../utils";
import { LeadTypeBadge } from "../LeadTypeBadge";

interface LeadsTableRowProps {
  lead: LeadCalls;
  formatDate: (date: string) => string;
  onEditLead: (lead: LeadCalls) => void;
}

export const LeadsTableRow = ({ lead, formatDate, onEditLead }: LeadsTableRowProps) => {
  // Check if there are any processed calls
  const hasProcessedCalls = lead.calls.some(call => call.status === "success");
  
  return (
    <TableRow>
      <TableCell className="font-medium text-xs">{getLeadName(lead)}</TableCell>
      <TableCell className="text-xs">
        <LeadTypeBadge leadType={lead.leadType} />
      </TableCell>
      <TableCell className="text-xs">{formatDate(lead.createdAt)}</TableCell>
      <TableCell className="text-xs">
        <LeadStatusBadge status={lead.status || "active"} />
      </TableCell>
      <TableCell className="text-xs">
        <LeadTemperatureBadge calls={lead.calls} hasProcessed={hasProcessedCalls} />
      </TableCell>
      <TableCell className="text-xs">
        {lead.crmInfo ? (
          <div className="text-xs space-y-1">
            <div className="text-[11px] text-gray-700">{lead.crmInfo.funnel}</div>
            <div className="text-[10px] text-gray-500">{lead.crmInfo.stage}</div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">Não integrado</span>
        )}
      </TableCell>
      <TableCell className="text-xs">
        <AIInteractionsCount calls={lead.calls} />
      </TableCell>
      <TableCell className="text-center">
        <LeadActionButtons lead={lead} onEditLead={onEditLead} />
      </TableCell>
    </TableRow>
  );
};
