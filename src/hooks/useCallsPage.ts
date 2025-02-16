
import { useState, useMemo } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";

export const useCallsPage = () => {
  // Inicializa o estado com as chamadas do mock
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [searchQuery, setSearchQuery] = useState<string>("");  // Explicitamente tipado como string
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
    // Adiciona o lead sem chamadas inicialmente
    setCalls(prevCalls => [
      ...prevCalls,
      {
        id: newLeadId,
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
          razaoSocial: leadData.razaoSocial || "",
          email: leadData.email || "",
          phone: leadData.phone || "",
        },
        emptyLead: true,
        isNewLead: true,
      },
    ]);
    return newLeadId;
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (withUpload && newCall) {
      // Atualiza a chamada existente ou adiciona uma nova com o status de sucesso
      setCalls(prevCalls => {
        const index = prevCalls.findIndex(call => call.leadId === newCall.leadId && call.emptyLead);
        if (index !== -1) {
          // Atualiza a chamada existente
          const updatedCalls = [...prevCalls];
          updatedCalls[index] = newCall;
          return updatedCalls;
        } else {
          // Adiciona uma nova chamada
          return [newCall, ...prevCalls];
        }
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
    const query = String(searchQuery).toLowerCase(); // Garante que searchQuery seja string
    
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
