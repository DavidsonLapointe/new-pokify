import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CallsTableProps } from "./types";
import { CallHistory } from "./CallHistory";
import { UploadCallDialog } from "./UploadCallDialog";
import { EmptyLeadsState } from "./table/EmptyLeadsState";
import { LeadsTableHeader } from "./table/LeadsTableHeader";
import { LeadsTableRow } from "./table/LeadsTableRow";
import { useLeadsData } from "./table/useLeadsData";

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLeadId, setUploadLeadId] = useState<string | null>(null);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  const { leadsWithCalls } = useLeadsData(calls);

  const handleShowCallHistory = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  const handleShowUpload = (lead: LeadCalls) => {
    setUploadLeadId(lead.id);
    setShowUpload(true);
  };

  const handleUploadSuccess = () => {
    // Aqui você pode implementar a lógica de atualização da lista de chamadas
    // após um upload bem-sucedido
  };

  if (leadsWithCalls.length === 0) {
    return (
      <EmptyLeadsState
        isCreateLeadOpen={isCreateLeadOpen}
        setIsCreateLeadOpen={setIsCreateLeadOpen}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <LeadsTableHeader />
          <TableBody>
            {leadsWithCalls.map((lead) => (
              <LeadsTableRow
                key={lead.id}
                lead={lead}
                formatDate={formatDate}
                onShowHistory={handleShowCallHistory}
                onShowUpload={handleShowUpload}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <CallHistory
        isOpen={showCallsHistory}
        onOpenChange={setShowCallsHistory}
        selectedLead={selectedLead}
        statusMap={statusMap}
        onPlayAudio={onPlayAudio}
        onViewAnalysis={onViewAnalysis}
        formatDate={formatDate}
      />

      {uploadLeadId && (
        <UploadCallDialog
          leadId={uploadLeadId}
          isOpen={showUpload}
          onOpenChange={(open) => {
            setShowUpload(open);
            if (!open) setUploadLeadId(null);
          }}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </TooltipProvider>
  );
};
