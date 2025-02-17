
import { useState, useMemo, useCallback } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { LeadWithCalls } from "@/types/leads";

export const useCallsPage = () => {
  // Convertemos as chamadas mock para o formato de leads com chamadas
  const initialLeads = useMemo(() => {
    const leadsMap = new Map<string, LeadWithCalls>();
    
    // Gera dados mock mais realistas para os últimos 30 dias
    const today = new Date();
    const mockData = Array.from({ length: 50 }).map((_, index) => {
      const randomDaysAgo = Math.floor(Math.random() * 30); // Distribuir ao longo dos últimos 30 dias
      const date = new Date(today);
      date.setDate(date.getDate() - randomDaysAgo);
      
      return {
        ...mockCalls[index % mockCalls.length],
        date: date.toISOString(),
        leadId: `lead-${Math.floor(index / 3)}`, // Agrupa chamadas por lead (3 chamadas por lead em média)
      };
    });

    mockData.forEach(call => {
      if (!leadsMap.has(call.leadId)) {
        leadsMap.set(call.leadId, {
          id: call.leadId,
          leadInfo: call.leadInfo,
          calls: [],
          createdAt: call.date
        });
      }
      leadsMap.get(call.leadId)?.calls.push(call);
    });
    
    return Array.from(leadsMap.values());
  }, []);

  const [leads, setLeads] = useState<LeadWithCalls[]>(initialLeads);
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

    // Cria um novo lead com array de chamadas vazio
    const newLead: LeadWithCalls = {
      id: leadId,
      leadInfo: {
        personType: leadData.personType,
        firstName: leadData.firstName,
        lastName: leadData.lastName || "",
        razaoSocial: leadData.razaoSocial || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
      },
      calls: [],
      createdAt: new Date().toISOString()
    };

    // Adiciona o novo lead à lista
    setLeads(prevLeads => {
      const updatedLeads = [newLead, ...prevLeads];
      console.log("Lista atualizada de leads:", updatedLeads);
      return updatedLeads;
    });

    setPendingLeadData(leadData);
    return leadId;
  }, []);

  const confirmNewLead = useCallback((withUpload: boolean = false, newCall?: Call) => {
    if (withUpload && newCall) {
      // Atualiza o lead existente adicionando a nova chamada
      setLeads(prevLeads => {
        return prevLeads.map(lead => {
          if (lead.id === newCall.leadId) {
            return {
              ...lead,
              calls: [newCall, ...lead.calls.filter(call => !call.emptyLead)]
            };
          }
          return lead;
        });
      });
    }

    toast({
      title: "Lead atualizado com sucesso",
      description: withUpload ? "Upload da chamada realizado com sucesso." : "Lead criado com sucesso.",
    });
  }, []);

  const handleUploadSuccess = useCallback((leadId: string, uploadedCall: Call) => {
    setLeads(prevLeads => {
      return prevLeads.map(lead => {
        if (lead.id === leadId) {
          // Remove chamadas vazias (emptyLead: true) e adiciona a nova chamada
          const updatedCalls = [
            uploadedCall,
            ...lead.calls.filter(call => !call.emptyLead)
          ];
          
          return {
            ...lead,
            calls: updatedCalls
          };
        }
        return lead;
      });
    });

    toast({
      title: "Upload realizado com sucesso",
      description: "A chamada foi adicionada ao histórico do lead.",
    });
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

  const filteredLeads = useMemo(() => {
    console.log("Filtrando leads com query:", searchQuery);
    console.log("Total de leads disponíveis:", leads.length);
    
    const query = (searchQuery || "").toLowerCase();
    
    return leads.filter(lead => {
      const leadName = lead.leadInfo.personType === "pf" 
        ? `${lead.leadInfo.firstName} ${lead.leadInfo.lastName || ""}`
        : lead.leadInfo.razaoSocial;
      
      return (
        (leadName && leadName.toLowerCase().includes(query)) ||
        lead.leadInfo.phone.includes(query) ||
        (lead.leadInfo.email && lead.leadInfo.email.toLowerCase().includes(query))
      );
    });
  }, [leads, searchQuery]);

  // Convertemos os leads filtrados para o formato esperado pela tabela
  const processedCalls = useMemo((): Call[] => {
    return filteredLeads.flatMap(lead => 
      lead.calls.length > 0 
        ? lead.calls 
        : [{
            id: uuidv4(),
            leadId: lead.id,
            date: lead.createdAt,
            duration: "0:00",
            status: "pending" as const,
            phone: lead.leadInfo.phone,
            seller: "Sistema",
            audioUrl: "",
            mediaType: "audio",
            leadInfo: lead.leadInfo,
            emptyLead: true,
            isNewLead: true,
          }]
    );
  }, [filteredLeads]);

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
