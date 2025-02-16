
import { Call, LeadCalls } from "../types";

export const useLeadsData = (calls: Call[]) => {
  // Primeiro, agrupa as chamadas por leadId
  const leadsMap = new Map<string, LeadCalls>();

  // Função auxiliar para criar um novo lead
  const createNewLead = (call: Call): LeadCalls => ({
    id: call.leadId,
    personType: call.leadInfo.personType,
    firstName: call.leadInfo.firstName,
    lastName: call.leadInfo.lastName,
    razaoSocial: call.leadInfo.razaoSocial,
    calls: [call],
    crmInfo: call.crmInfo,
    createdAt: call.date,
  });

  // Processa todas as chamadas
  calls.forEach(call => {
    const existingLead = leadsMap.get(call.leadId);
    
    if (existingLead) {
      // Se o lead já existe, adiciona a chamada à lista
      existingLead.calls.push(call);
    } else {
      // Se é um novo lead, cria uma nova entrada no Map
      const newLead = createNewLead(call);
      leadsMap.set(call.leadId, newLead);
    }
  });

  // Se há leads sem chamadas (recém-criados), eles devem estar em um formato específico
  // dentro das chamadas, com uma propriedade isNewLead
  const newLeads = calls.filter(call => 'isNewLead' in call).map(call => ({
    id: call.leadId,
    personType: call.leadInfo.personType,
    firstName: call.leadInfo.firstName,
    lastName: call.leadInfo.lastName,
    razaoSocial: call.leadInfo.razaoSocial,
    calls: [], // Array vazio de chamadas
    crmInfo: call.crmInfo,
    createdAt: call.date,
  }));

  // Adiciona os novos leads ao Map
  newLeads.forEach(lead => {
    if (!leadsMap.has(lead.id)) {
      leadsMap.set(lead.id, lead);
    }
  });

  // Converte o Map para array
  const leadsWithCalls = Array.from(leadsMap.values());

  return { leadsWithCalls };
};
