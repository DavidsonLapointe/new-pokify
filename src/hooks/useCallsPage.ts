
import { useState, useMemo, useCallback } from "react";
import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { useCallsFilter } from "./calls/useCallsFilter";
import { useLeadsManagement } from "./calls/useLeadsManagement";
import { v4 as uuidv4 } from "uuid";
import { LeadWithCalls } from "@/types/leads";

export const useCallsPage = () => {
  const [leads, setLeads] = useState<LeadWithCalls[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [monthStats] = useState({
    total: 45,
    processed: 32,
    pending: 10,
    failed: 3,
  });
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handlePlayAudio = useCallback((audioUrl: string) => {
    console.log(`Reproduzindo áudio: ${audioUrl}`);
  }, []);

  const handleViewAnalysis = useCallback((call: Call) => {
    setSelectedCall(call);
    setIsAnalysisOpen(true);
  }, []);

  const handleCloseAnalysis = useCallback(() => {
    setIsAnalysisOpen(false);
    setSelectedCall(null);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  const createNewLead = useCallback(async (data: LeadFormData) => {
    const leadId = uuidv4();
    console.log("Criando novo lead:", { leadId, data });
    return leadId;
  }, []);

  const confirmNewLead = useCallback((withUpload: boolean, newCall?: Call) => {
    if (newCall) {
      setLeads(prevLeads => {
        const newLeadWithCalls: LeadWithCalls = {
          id: newCall.leadId,
          leadInfo: newCall.leadInfo,
          calls: [newCall],
          createdAt: newCall.date
        };
        
        const updatedLeads = [newLeadWithCalls, ...prevLeads];
        console.log("Leads atualizados após confirmação:", updatedLeads);
        return updatedLeads;
      });
    }
  }, []);

  const { filterLeads, processCallsData } = useCallsFilter(leads, searchQuery);
  const filteredLeads = useMemo(() => filterLeads(), [leads, searchQuery]);
  const processedCalls = useMemo(() => processCallsData(filteredLeads), [filteredLeads]);

  return {
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredLeads: processedCalls,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
    createNewLead,
    confirmNewLead,
  };
};
