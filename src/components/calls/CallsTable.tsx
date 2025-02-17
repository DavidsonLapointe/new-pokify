
import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CallsTableProps, LeadCalls } from "./types";
import { CallHistory } from "./CallHistory";
import { UploadCallDialog } from "./UploadCallDialog";
import { EmptyLeadsState } from "./table/EmptyLeadsState";
import { LeadsTableHeader } from "./table/LeadsTableHeader";
import { LeadsTableRow } from "./table/LeadsTableRow";
import { useLeadsData } from "./table/useLeadsData";
import { Call } from "@/types/calls";

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
  const [uploadLeadInfo, setUploadLeadInfo] = useState<Call["leadInfo"] | undefined>();
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  const { leadsWithCalls, updateLeadCalls } = useLeadsData(calls);

  const handleShowCallHistory = (lead: LeadCalls) => {
    console.log("Mostrando histórico para lead:", lead);
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  const handleShowUpload = (lead: LeadCalls) => {
    setUploadLeadId(lead.id);
    setUploadLeadInfo({
      personType: lead.personType,
      firstName: lead.firstName,
      lastName: lead.lastName,
      razaoSocial: lead.razaoSocial,
      phone: lead.calls[0]?.phone || ""
    });
    setShowUpload(true);
  };

  const handleUploadSuccess = (newCall?: Call) => {
    if (newCall && uploadLeadId) {
      updateLeadCalls(uploadLeadId, newCall);
    }
    setShowUpload(false);
    setUploadLeadId(null);
    setUploadLeadInfo(undefined);
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
            if (!open) {
              setUploadLeadId(null);
              setUploadLeadInfo(undefined);
            }
          }}
          onUploadSuccess={handleUploadSuccess}
          leadInfo={uploadLeadInfo}
        />
      )}
    </TooltipProvider>
  );
};
