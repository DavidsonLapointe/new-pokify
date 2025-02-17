
import { useState, useMemo, useCallback } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

export const useCallsPage = () => {
  const [calls, setCalls] = useState<Call[]>(mockCalls);
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

  const createNewLead = useCallback((leadData: LeadFormData) => {
    console.log("Dados do lead recebidos em createNewLead:", leadData);
    const leadId = uuidv4();
    setPendingLeadData(leadData);
    return leadId;
  }, []);

  const confirmNewLead = useCallback((withUpload: boolean = false, newCall?: Call) => {
    console.log("Confirmando novo lead - withUpload:", withUpload);
    console.log("pendingLeadData:", pendingLeadData);
    console.log("newCall:", newCall);

    if (!withUpload && pendingLeadData) {
      const leadId = uuidv4();
      console.log("Criando chamada vazia com dados:", pendingLeadData);

      // Verifica se os dados obrigatórios estão presentes
      if (!pendingLeadData.firstName) {
        console.error("Nome do lead está vazio!");
        return;
      }

      const emptyCall: Call = {
        id: uuidv4(),
        leadId,
        date: new Date().toISOString(),
        duration: "0:00",
        status: "pending",
        phone: pendingLeadData.phone || "",
        seller: "Sistema",
        audioUrl: "",
        mediaType: "audio",
        leadInfo: {
          personType: pendingLeadData.personType,
          firstName: pendingLeadData.firstName, // Campo obrigatório
          lastName: pendingLeadData.lastName || "",
          razaoSocial: pendingLeadData.razaoSocial || "",
          email: pendingLeadData.email || "",
          phone: pendingLeadData.phone || "",
        },
        emptyLead: true,
        isNewLead: true,
      };

      console.log("Chamada vazia criada:", emptyCall);
      
      setCalls(prevCalls => {
        const newCalls = [emptyCall, ...prevCalls];
        console.log("Nova lista de chamadas:", newCalls);
        return newCalls;
      });

      setPendingLeadData(null);
      
      toast({
        title: "Lead criado com sucesso",
        description: "O novo lead foi adicionado à lista.",
      });
    } else if (withUpload && newCall) {
      console.log("Atualizando lead com upload:", newCall);
      setCalls(prevCalls => {
        const index = prevCalls.findIndex(call => call.leadId === newCall.leadId);
        if (index !== -1) {
          const filteredCalls = prevCalls.filter(call => 
            !(call.leadId === newCall.leadId && call.emptyLead)
          );
          return [newCall, ...filteredCalls];
        }
        return [newCall, ...prevCalls];
      });
    }
  }, [pendingLeadData]);

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

  const filteredLeads = useMemo(() => {
    console.log("Filtrando chamadas com query:", searchQuery);
    console.log("Chamadas disponíveis:", calls);
    
    const query = (searchQuery || "").toLowerCase();
    
    return calls.filter(call => {
      const leadName = call.leadInfo.personType === "pf" 
        ? `${call.leadInfo.firstName} ${call.leadInfo.lastName || ""}`
        : call.leadInfo.razaoSocial;
      
      console.log("Lead name para filtro:", leadName);
      
      return (
        (leadName && leadName.toLowerCase().includes(query)) ||
        call.phone.includes(query) ||
        (call.leadInfo.email && call.leadInfo.email.toLowerCase().includes(query))
      );
    });
  }, [calls, searchQuery]);

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
