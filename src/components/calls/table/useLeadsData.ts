
import { Call, LeadCalls } from "../types";
import { useState, useCallback } from "react";

export const useLeadsData = (initialCalls: Call[]) => {
  const [calls, setCalls] = useState(initialCalls);

  const processLeads = useCallback((callsData: Call[]) => {
    const leadsMap = new Map<string, LeadCalls>();

    console.log("Processando chamadas:", callsData);

    callsData.forEach(call => {
      if (!call.leadId || !call.leadInfo) {
        console.log("Chamada ignorada - sem leadId ou leadInfo:", call);
        return;
      }

      const existingLead = leadsMap.get(call.leadId);
      
      if (existingLead) {
        // Sempre adiciona a chamada ao lead existente
        existingLead.calls.push(call);
        console.log(`Chamada ${call.id} adicionada ao lead ${call.leadId}`);
        
        // Atualiza a data de criação se esta chamada for mais antiga
        if (new Date(call.date) < new Date(existingLead.createdAt)) {
          existingLead.createdAt = call.date;
        }
        // Atualiza as informações do CRM se disponíveis
        if (call.crmInfo) {
          existingLead.crmInfo = call.crmInfo;
        }
      } else {
        // Cria um novo lead com a primeira chamada
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
        console.log(`Novo lead criado: ${call.leadId}`, newLead);
      }
    });

    // Ordena as chamadas de cada lead por data (mais recente primeiro)
    leadsMap.forEach(lead => {
      lead.calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log(`Lead ${lead.id} com ${lead.calls.length} chamadas após ordenação:`, lead.calls);
    });

    return Array.from(leadsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  const updateLeadCalls = useCallback((leadId: string, newCall: Call) => {
    setCalls(prevCalls => {
      // Adiciona a nova chamada ao início do array
      const updatedCalls = [newCall, ...prevCalls];
      console.log("Chamadas atualizadas:", updatedCalls);
      return updatedCalls;
    });
  }, []);

  const leadsWithCalls = processLeads(calls);

  return { leadsWithCalls, updateLeadCalls };
};
