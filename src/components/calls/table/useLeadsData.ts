
import { Call, LeadCalls } from "../types";

export const useLeadsData = (calls: Call[]) => {
  // Primeiro, agrupa as chamadas por leadId
  const leadsMap = new Map<string, LeadCalls>();

  // Processa todas as chamadas
  calls.forEach(call => {
    // Ignora chamadas sem leadId ou leadInfo
    if (!call.leadId || !call.leadInfo) return;

    const existingLead = leadsMap.get(call.leadId);
    
    if (existingLead) {
      // Se o lead já existe, adiciona a chamada à lista de chamadas dele
      existingLead.calls.push(call);
      // Atualiza a data de criação se esta chamada for mais antiga
      if (new Date(call.date) < new Date(existingLead.createdAt)) {
        existingLead.createdAt = call.date;
      }
      // Atualiza as informações do CRM se disponíveis
      if (call.crmInfo) {
        existingLead.crmInfo = call.crmInfo;
      }
    } else {
      // Se o lead não existe, cria um novo com a primeira chamada
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

  // Para cada lead, ordena as chamadas por data (mais recente primeiro)
  leadsMap.forEach(lead => {
    lead.calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // Converte o Map para array e ordena por data de criação (mais recente primeiro)
  const leadsWithCalls = Array.from(leadsMap.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log('Leads processados:', leadsWithCalls);
  return { leadsWithCalls };
};
