
import { LeadWithCalls } from "@/types/leads";
import { mockCalls } from "@/mocks/calls";

export const useMockData = () => {
  // Gera dados mock mais realistas para os últimos 30 dias
  const generateMockData = () => {
    const leadsMap = new Map<string, LeadWithCalls>();
    const today = new Date();
    
    const mockData = Array.from({ length: 50 }).map((_, index) => {
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const date = new Date(today);
      date.setDate(date.getDate() - randomDaysAgo);
      
      return {
        ...mockCalls[index % mockCalls.length],
        date: date.toISOString(),
        leadId: `lead-${Math.floor(index / 3)}`,
      };
    });

    mockData.forEach(call => {
      if (!leadsMap.has(call.leadId)) {
        leadsMap.set(call.leadId, {
          id: call.leadId,
          leadInfo: call.leadInfo,
          calls: [],
          createdAt: call.date
        });
      }
      leadsMap.get(call.leadId)?.calls.push(call);
    });
    
    return Array.from(leadsMap.values());
  };

  return { generateMockData };
};
