
import { Call, LeadCalls } from "../types";
import { useState, useCallback, useEffect } from "react";

/**
 * Hook para gerenciar os dados dos leads e suas chamadas.
 * @param initialCalls Array inicial de chamadas
 * @returns Objeto contendo os leads processados e função para atualização
 */
export const useLeadsData = (initialCalls: Call[]) => {
  const [calls, setCalls] = useState(initialCalls);

  // Atualiza o estado local quando as chamadas iniciais mudarem
  useEffect(() => {
    setCalls(initialCalls);
  }, [initialCalls]);

  /**
   * Processa as chamadas para criar e atualizar leads.
   * Regras importantes:
   * 1. Um lead é sempre exibido na lista, mesmo sem chamadas
   * 2. Apenas chamadas válidas (status success e não vazias) são contabilizadas
   * 3. A ordenação é feita pela data mais recente
   */
  const processLeads = useCallback((callsData: Call[]) => {
    const leadsMap = new Map<string, LeadCalls>();

    console.log("Processando chamadas:", callsData);

    // Primeiro, processa todas as chamadas para criar/atualizar leads
    callsData.forEach(call => {
      // Validação básica dos dados da chamada
      if (!call.leadId || !call.leadInfo) {
        console.log("Chamada ignorada - sem leadId ou leadInfo:", call);
        return;
      }

      // Uma chamada é válida apenas quando tem status success e não é vazia
      const isValidCall = !call.emptyLead && call.status === "success";

      const existingLead = leadsMap.get(call.leadId);
      
      if (existingLead) {
        // IMPORTANTE: Adiciona apenas chamadas válidas ao array de calls
        // Isto garante que a contagem na interface será precisa
        if (isValidCall) {
          existingLead.calls.push(call);
          console.log(`Chamada válida ${call.id} adicionada ao lead ${call.leadId}`);
        }
        
        // Atualiza a data de criação se esta chamada for mais antiga
        if (new Date(call.date) < new Date(existingLead.createdAt)) {
          existingLead.createdAt = call.date;
        }
        // Atualiza as informações do CRM se disponíveis
        if (call.crmInfo) {
          existingLead.crmInfo = call.crmInfo;
        }
      } else {
        // Cria um novo lead, inicializando o array de calls
        // IMPORTANTE: Só adiciona a chamada se for válida
        const newLead: LeadCalls = {
          id: call.leadId,
          personType: call.leadInfo.personType,
          firstName: call.leadInfo.firstName,
          lastName: call.leadInfo.lastName,
          razaoSocial: call.leadInfo.razaoSocial,
          calls: isValidCall ? [call] : [], // Array vazio se a chamada não for válida
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

    // Retorna os leads ordenados por data de criação (mais recente primeiro)
    return Array.from(leadsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  /**
   * Atualiza as chamadas de um lead específico.
   * IMPORTANTE: 
   * - Chamadas válidas são adicionadas ao array
   * - Leads sem chamadas válidas ainda são mantidos na lista
   */
  const updateLeadCalls = useCallback((leadId: string, newCall: Call) => {
    setCalls(prevCalls => {
      // Adiciona a nova chamada ao início do array apenas se for uma chamada válida
      if (!newCall.emptyLead && newCall.status === "success") {
        const updatedCalls = [newCall, ...prevCalls];
        console.log("Chamadas atualizadas:", updatedCalls);
        return updatedCalls;
      }
      // IMPORTANTE: Se não for uma chamada válida, ainda precisamos incluir o lead
      // Isso garante que o lead apareça na lista mesmo sem chamadas válidas
      if (!prevCalls.some(call => call.leadId === newCall.leadId)) {
        return [...prevCalls, newCall];
      }
      return prevCalls;
    });
  }, []);

  const leadsWithCalls = processLeads(calls);

  return { leadsWithCalls, updateLeadCalls };
};
