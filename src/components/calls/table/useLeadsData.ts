
import { Call, LeadCalls } from "../types";

export const useLeadsData = (calls: Call[]) => {
  // Primeiro, agrupa as chamadas por leadId
  const leadsMap = new Map<string, LeadCalls>();

  calls.forEach(call => {
    const existingLead = leadsMap.get(call.leadId);
    
    if (existingLead) {
      existingLead.calls.push(call);
    } else {
      const newLead: LeadCalls = {
        id: call.leadId,
        personType: call.leadInfo.personType,
        firstName: call.leadInfo.firstName,
        lastName: call.leadInfo.lastName,
        razaoSocial: call.leadInfo.razaoSocial,
        calls: [call],
        crmInfo: call.crmInfo,
        createdAt: call.date,
      };
      leadsMap.set(call.leadId, newLead);
    }
  });

  // Converte o Map para array
  const leadsWithCalls = Array.from(leadsMap.values());

  return { leadsWithCalls };
};
