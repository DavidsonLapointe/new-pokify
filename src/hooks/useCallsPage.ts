
import { useState, useMemo, useCallback } from "react";
import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { useMockData } from "./calls/useMockData";
import { useCallsFilter } from "./calls/useCallsFilter";
import { useLeadsManagement } from "./calls/useLeadsManagement";

export const useCallsPage = () => {
  const { generateMockData } = useMockData();
  const initialLeads = useMemo(() => generateMockData(), []);
  
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [monthStats] = useState({
    total: 45,
    processed: 32,
    pending: 10,
    failed: 3,
  });
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [pendingLeadData, setPendingLeadData] = useState<LeadFormData | null>(null);

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

  const { filterLeads, processCallsData } = useCallsFilter(leads, searchQuery);
  const filteredLeads = useMemo(() => filterLeads(), [leads, searchQuery]);
  const processedCalls = useMemo(() => processCallsData(filteredLeads), [filteredLeads]);

  const { createNewLead, confirmNewLead, handleUploadSuccess } = useLeadsManagement(
    setLeads,
    setPendingLeadData
  );

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
    handleUploadSuccess,
  };
};
