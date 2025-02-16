
import { useState } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";

interface LeadWithCalls {
  id: string;
  leadInfo: Call['leadInfo'];
  calls: Call[];
}

export const useCallsPage = () => {
  const [calls, setCalls] = useState(mockCalls);
  const [leads, setLeads] = useState<LeadWithCalls[]>([]);
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
    
    // Criar novo lead sem chamadas
    const newLead: LeadWithCalls = {
      id: newLeadId,
      leadInfo: {
        personType: leadData.personType,
        firstName: leadData.firstName,
        lastName: leadData.lastName || "",
        razaoSocial: leadData.razaoSocial || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
      },
      calls: []
    };
    
    setLeads(prevLeads => [newLead, ...prevLeads]);
    console.log("Novo lead criado:", newLead);
    return newLeadId;
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (withUpload && newCall) {
      // Adiciona a chamada à lista geral de chamadas
      setCalls(prevCalls => [newCall, ...prevCalls]);
      
      // Atualiza o lead com a nova chamada
      setLeads(prevLeads => prevLeads.map(lead => {
        if (lead.id === newCall.leadId) {
          return {
            ...lead,
            calls: [newCall, ...lead.calls]
          };
        }
        return lead;
      }));
      
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

  // Combina os leads existentes do mockCalls com os novos leads
  const allLeads = [...leads];
  
  // Agrupa as chamadas mock por leadId se ainda não existirem na lista de leads
  const mockLeadsMap = new Map<string, LeadWithCalls>();
  calls.forEach(call => {
    if (!leads.some(l => l.id === call.leadId)) {
      if (!mockLeadsMap.has(call.leadId)) {
        mockLeadsMap.set(call.leadId, {
          id: call.leadId,
          leadInfo: call.leadInfo,
          calls: [call]
        });
      } else {
        mockLeadsMap.get(call.leadId)?.calls.push(call);
      }
    }
  });
  
  // Adiciona os leads do mock à lista completa
  mockLeadsMap.forEach(lead => {
    allLeads.push(lead);
  });

  const filteredLeads = allLeads.filter(lead => {
    const searchTerms = searchQuery.toLowerCase();
    const leadName = lead.leadInfo.personType === "pf" 
      ? `${lead.leadInfo.firstName} ${lead.leadInfo.lastName || ""}`
      : lead.leadInfo.razaoSocial;
    
    return (
      (leadName && leadName.toLowerCase().includes(searchTerms)) ||
      lead.leadInfo.phone.includes(searchTerms) ||
      (lead.leadInfo.email && lead.leadInfo.email.toLowerCase().includes(searchTerms))
    );
  });

  console.log("Leads processados:", filteredLeads);

  return {
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredLeads, // Agora retornamos leads em vez de calls
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
