
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
    calls: ('emptyLead' in call) ? [] : [call], // Se for um lead vazio, inicializa com array vazio
    crmInfo: call.crmInfo,
    createdAt: call.date,
  });

  // Processa todas as chamadas
  calls.forEach(call => {
    if ('emptyLead' in call) {
      // Se é um lead vazio, apenas cria a entrada no Map se ela não existir
      if (!leadsMap.has(call.leadId)) {
        const newLead = createNewLead(call);
        leadsMap.set(call.leadId, newLead);
      }
    } else {
      // Processamento normal para chamadas
      const existingLead = leadsMap.get(call.leadId);
      if (existingLead) {
        existingLead.calls.push(call);
      } else {
        const newLead = createNewLead(call);
        leadsMap.set(call.leadId, newLead);
      }
    }
  });

  // Converte o Map para array
  const leadsWithCalls = Array.from(leadsMap.values());

  return { leadsWithCalls };
};
