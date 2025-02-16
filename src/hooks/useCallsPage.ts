
import { useState, useMemo } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";

interface LeadWithCalls {
  id: string;
  leadInfo: Call['leadInfo'];
  calls: Call[];
}

// Função auxiliar para processar os leads do mock
const processMockLeads = (mockCalls: Call[]): LeadWithCalls[] => {
  const mockLeadsMap = new Map<string, LeadWithCalls>();
  
  mockCalls.forEach(call => {
    if (!mockLeadsMap.has(call.leadId)) {
      mockLeadsMap.set(call.leadId, {
        id: call.leadId,
        leadInfo: call.leadInfo,
        calls: [call]
      });
    } else {
      mockLeadsMap.get(call.leadId)?.calls.push(call);
    }
  });

  return Array.from(mockLeadsMap.values());
};

export const useCallsPage = () => {
  // Inicializa o estado com os leads do mock
  const [calls, setCalls] = useState(mockCalls);
  const [leads, setLeads] = useState<LeadWithCalls[]>(() => processMockLeads(mockCalls));
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
      setCalls(prevCalls => [newCall, ...prevCalls]);
      
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

  // Usa useMemo para filtrar os leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
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
  }, [leads, searchQuery]);

  console.log("Leads processados:", filteredLeads);

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
    getLeadCalls,
  };
};
