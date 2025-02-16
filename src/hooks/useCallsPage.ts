
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
    const newCall: Call = {
      id: uuidv4(),
      leadId: newLeadId,
      date: new Date().toISOString(),
      duration: "0:00",
      status: "pending",
      phone: leadData.phone || "",
      seller: "Sistema",
      audioUrl: "",
      mediaType: "audio",
      leadInfo: {
        personType: leadData.personType,
        firstName: leadData.firstName,
        lastName: leadData.lastName || "",
        email: leadData.email || "",
        razaoSocial: leadData.razaoSocial || "",
        phone: leadData.phone || "",
      },
    };

    setPendingLead(newCall);
    return newLeadId;
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (newCall) {
      // Se um newCall for fornecido, use-o diretamente
      setCalls(prevCalls => [newCall, ...prevCalls]);
    } else if (pendingLead) {
      if (withUpload) {
        // Se houver upload, adiciona a chamada junto com o lead
        setCalls(prevCalls => [pendingLead, ...prevCalls]);
      } else {
        // Se não houver upload, adiciona apenas o lead sem a chamada
        const leadWithoutCall: Call = {
          ...pendingLead,
          status: "pending",
          duration: "0:00",
          audioUrl: "",
        };
        setCalls(prevCalls => [leadWithoutCall, ...prevCalls]);
      }
      setPendingLead(null);
    }
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
  };
};
