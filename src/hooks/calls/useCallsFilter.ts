
import { Call } from "@/types/calls";
import { LeadWithCalls } from "@/types/leads";
import { v4 as uuidv4 } from "uuid";

export const useCallsFilter = (leads: LeadWithCalls[], searchQuery: string) => {
  const filterLeads = () => {
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
  };

  const processCallsData = (filteredLeads: LeadWithCalls[]): Call[] => {
    return filteredLeads.flatMap(lead => {
      const validCalls = lead.calls.filter(call => !call.emptyLead);
      
      if (validCalls.length > 0) {
        return validCalls;
      }
      
      // Se não houver chamadas válidas, cria uma chamada inicial
      return [{
        id: uuidv4(),
        leadId: lead.id,
        date: lead.createdAt,
        duration: "0:00",
        status: "failed" as const,
        phone: lead.leadInfo.phone,
        seller: "Sistema",
        audioUrl: "",
        mediaType: "audio",
        leadInfo: lead.leadInfo,
        emptyLead: true,
        isNewLead: true,
      }];
    });
  };

  return { filterLeads, processCallsData };
};
