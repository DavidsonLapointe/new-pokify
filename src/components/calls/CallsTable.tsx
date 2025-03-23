
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Call } from "@/types/calls";
import { LeadCalls } from "./types";
import { CallHistory } from "./CallHistory";
import { EmptyLeadsState } from "./table/EmptyLeadsState";
import { useLeadsData } from "./table/useLeadsData";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { LeadTabs } from "./tabs/LeadTabs";
import { toast } from "sonner";

interface CallsTableProps {
  calls: Call[];
  statusMap: any;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  const { leadsWithCalls, updateLeadCalls } = useLeadsData(calls);

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

  // Função auxiliar para obter o nome do lead
  const getLeadName = (lead: LeadCalls): string => {
    if (lead.personType === "pj" && lead.razaoSocial) {
      return lead.razaoSocial;
    }
    
    return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
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
