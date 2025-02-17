
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
  const pendingCallsRef = useRef<Call[]>([]);

  useEffect(() => {
    if (pendingCallsRef.current.length > 0) {
      const updatedCalls = [...pendingCallsRef.current, ...calls];
      setCalls(updatedCalls);
      pendingCallsRef.current = [];
      console.log("Atualizando lista de chamadas com pendentes:", updatedCalls);
    }
  }, [calls]);

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
    
    if (!withUpload && pendingLeadData) {
      const leadId = uuidv4();
      
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
          firstName: pendingLeadData.firstName,
          lastName: pendingLeadData.lastName || "",
          razaoSocial: pendingLeadData.razaoSocial || "",
          email: pendingLeadData.email || "",
          phone: pendingLeadData.phone || "",
        },
        emptyLead: true,
        isNewLead: true,
      };

      console.log("Chamada vazia criada:", emptyCall);
      
      // Adiciona a nova chamada à fila de pendentes
      pendingCallsRef.current = [emptyCall];
      
      // Força uma atualização do estado calls para disparar o useEffect
      setCalls(prevCalls => [...prevCalls]);
      
      setPendingLeadData(null);
      
      toast({
        title: "Lead criado com sucesso",
        description: "O novo lead foi adicionado à lista.",
      });
    } else if (withUpload && newCall) {
      console.log("Atualizando lead com upload:", newCall);
      setCalls(prevCalls => {
        const filteredCalls = prevCalls.filter(call => 
          !(call.leadId === newCall.leadId && call.emptyLead)
        );
        return [newCall, ...filteredCalls];
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
    const allCalls = [...calls, ...pendingCallsRef.current];
    console.log("Total de chamadas disponíveis:", allCalls.length);
    
    const query = (searchQuery || "").toLowerCase();
    
    return allCalls.filter(call => {
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
