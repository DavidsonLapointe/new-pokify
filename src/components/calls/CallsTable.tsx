
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Call } from "@/types/calls";
import { LeadCalls } from "./types";
import { CallHistory } from "./CallHistory";
import { EmptyLeadsState } from "./table/EmptyLeadsState";
import { useLeadsData } from "./table/useLeadsData";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { LeadTabs } from "./tabs/LeadTabs";
import { toast } from "sonner";
import { getLeadName } from "./utils";

interface CallsTableProps {
  calls: Call[];
  statusMap: any;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
  searchQuery,
  onSearchChange,
}: CallsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  // Use the useLeadsData hook to process the calls into leads
  const { leadsWithCalls, updateLeadCalls } = useLeadsData(calls);

  console.log("Processed leads with calls:", leadsWithCalls); // Debug log to verify data
  
  const handleShowCallHistory = (lead: LeadCalls) => {
    console.log("Mostrando histórico para lead:", lead);
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  const handleEditLead = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleUpdateLead = (updatedLead: LeadCalls) => {
    // Aqui você pode implementar a lógica para atualizar o lead
    // Por enquanto, vamos apenas mostrar um toast
    toast.success(`Lead ${getLeadName(updatedLead)} atualizado com sucesso!`);
    setShowLeadDetails(false);
  };

  if (!calls || calls.length === 0) {
    return (
      <EmptyLeadsState
        isCreateLeadOpen={isCreateLeadOpen}
        setIsCreateLeadOpen={setIsCreateLeadOpen}
      />
    );
  }

  return (
    <TooltipProvider>
      <div>
        <LeadTabs 
          leads={leadsWithCalls} 
          formatDate={formatDate} 
          onEditLead={handleEditLead}
          onAddLead={() => setIsCreateLeadOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <CallHistory
          isOpen={showCallsHistory}
          onOpenChange={setShowCallsHistory}
          selectedLead={selectedLead}
          statusMap={statusMap}
          onPlayAudio={onPlayAudio}
          onViewAnalysis={onViewAnalysis}
          formatDate={formatDate}
        />

        {selectedLead && (
          <LeadDetailsDialog
            isOpen={showLeadDetails}
            onClose={() => setShowLeadDetails(false)}
            lead={selectedLead}
            onUpdateLead={handleUpdateLead}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
