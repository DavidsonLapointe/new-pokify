
import { useState } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";

export const useCallsPage = () => {
  const [calls, setCalls] = useState(mockCalls);
  const [pendingLead, setPendingLead] = useState<Call | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [monthStats] = useState({
    total: 45,
    processed: 32,
    pending: 10,
    failed: 3,
  });
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handlePlayAudio = (audioUrl: string) => {
    console.log(`Reproduzindo áudio: ${audioUrl}`);
  };

  const handleViewAnalysis = (call: Call) => {
    setSelectedCall(call);
    setIsAnalysisOpen(true);
  };

  const handleCloseAnalysis = () => {
    setIsAnalysisOpen(false);
    setSelectedCall(null);
  };

  const createNewLead = (leadData: LeadFormData) => {
    const newLeadId = uuidv4();
    // Não criamos nenhuma chamada aqui, apenas retornamos o ID
    console.log("Novo lead criado com ID:", newLeadId);
    return newLeadId;
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (withUpload && newCall) {
      // Apenas adiciona a chamada se houver upload
      setCalls(prevCalls => [newCall, ...prevCalls]);
      console.log("Nova chamada adicionada:", newCall);
    }
    setPendingLead(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getLeadCalls = (leadId: string) => {
    return calls.filter(call => call.leadId === leadId);
  };

  const filteredCalls = calls.filter((call) => {
    const searchTerms = searchQuery.toLowerCase();
    const leadName = call.leadInfo.personType === "pf" 
      ? `${call.leadInfo.firstName} ${call.leadInfo.lastName || ""}`
      : call.leadInfo.razaoSocial;
    
    return (
      (leadName && leadName.toLowerCase().includes(searchTerms)) ||
      call.phone.includes(searchTerms) ||
      (call.leadInfo.email && call.leadInfo.email.toLowerCase().includes(searchTerms))
    );
  });

  console.log("Leads processados:", filteredCalls);

  return {
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredCalls,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
    createNewLead,
    confirmNewLead,
    getLeadCalls,
  };
};
