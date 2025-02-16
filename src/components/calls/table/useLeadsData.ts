
import { Call, LeadCalls } from "../types";

export const useLeadsData = (calls: Call[]) => {
  // Primeiro, agrupa as chamadas por leadId
  const leadsMap = new Map<string, LeadCalls>();

  // Processa todas as chamadas
  calls.forEach(call => {
    const existingLead = leadsMap.get(call.leadId);
    
    if (existingLead) {
      // Se o lead já existe, adiciona a chamada à lista de chamadas dele
      if (!call.emptyLead) {
        existingLead.calls.push(call);
      }
    } else {
      // Se o lead não existe, cria um novo com a primeira chamada
      const newLead: LeadCalls = {
        id: call.leadId,
        personType: call.leadInfo.personType,
        firstName: call.leadInfo.firstName,
        lastName: call.leadInfo.lastName,
        razaoSocial: call.leadInfo.razaoSocial,
        calls: call.emptyLead ? [] : [call],
        crmInfo: call.crmInfo,
        createdAt: call.date,
      };
      leadsMap.set(call.leadId, newLead);
    }
  });

  // Converte o Map para array e ordena por data de criação (mais recente primeiro)
  const leadsWithCalls = Array.from(leadsMap.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log('Leads processados:', leadsWithCalls);
  return { leadsWithCalls };
};
