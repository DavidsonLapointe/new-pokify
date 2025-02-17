
import { useState, useMemo } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";

export const useCallsPage = () => {
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [searchQuery, setSearchQuery] = useState<string>();
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
    // Apenas retorna o ID do novo lead, sem adicionar chamada
    return uuidv4();
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (!withUpload && !newCall) {
      // Quando o lead é criado inicialmente, sem upload
      const emptyCall: Call = {
        id: uuidv4(),
        leadId: newCall?.leadId || "",
        date: new Date().toISOString(),
        duration: "0:00",
        status: "pending",
        phone: "",
        seller: "Sistema",
        audioUrl: "",
        mediaType: "audio",
        leadInfo: newCall?.leadInfo || {
          personType: "pf",
          firstName: "",
          lastName: "",
          razaoSocial: "",
          email: "",
          phone: "",
        },
        emptyLead: true,
        isNewLead: true,
      };
      setCalls(prevCalls => [emptyCall, ...prevCalls]);
    } else if (withUpload && newCall) {
      // Quando um upload é realizado com sucesso
      setCalls(prevCalls => {
        const index = prevCalls.findIndex(call => call.leadId === newCall.leadId);
        if (index !== -1) {
          // Remove a chamada vazia e adiciona a nova com upload
          const filteredCalls = prevCalls.filter(call => 
            !(call.leadId === newCall.leadId && call.emptyLead)
          );
          return [newCall, ...filteredCalls];
        }
        return [newCall, ...prevCalls];
      });
      console.log("Nova chamada adicionada:", newCall);
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

  // Usa useMemo para filtrar as chamadas
  const filteredLeads = useMemo(() => {
    console.log("Filtrando chamadas com query:", searchQuery);
    const query = String(searchQuery || "").toLowerCase();
    
    return calls.filter(call => {
      const leadName = call.leadInfo.personType === "pf" 
        ? `${call.leadInfo.firstName} ${call.leadInfo.lastName || ""}`
        : call.leadInfo.razaoSocial;
      
      return (
        (leadName && leadName.toLowerCase().includes(query)) ||
        call.phone.includes(query) ||
        (call.leadInfo.email && call.leadInfo.email.toLowerCase().includes(query))
      );
    });
  }, [calls, searchQuery]);

  console.log("Chamadas filtradas:", filteredLeads);

  return {
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredLeads,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
    createNewLead,
    confirmNewLead,
  };
};
