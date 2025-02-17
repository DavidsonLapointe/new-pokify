
import { LeadWithCalls } from "@/types/leads";
import { mockCalls } from "@/mocks/calls";

// Lista de nomes e sobrenomes para gerar dados mais diversos
const firstNames = [
  "Carlos", "Ana", "João", "Maria", "Pedro", "Julia", "Lucas", "Beatriz",
  "Rafael", "Fernanda"
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida",
  "Pereira", "Lima", "Costa"
];

const companies = [
  "Tech Solutions", "Inovação Digital", "Empresa XYZ", "Comércio ABC",
  "Indústria 123", "Serviços Ltda", "Consultoria SA", "Varejo Express",
  "Software House", "Distribuidora Plus"
];

export const useMockData = () => {
  // Gera dados mock mais realistas para os últimos 30 dias
  const generateMockData = () => {
    const leadsMap = new Map<string, LeadWithCalls>();
    const today = new Date();
    
    const mockData = Array.from({ length: 50 }).map((_, index) => {
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const date = new Date(today);
      date.setDate(date.getDate() - randomDaysAgo);
      
      const baseCall = mockCalls[index % mockCalls.length];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      // Cria uma nova chamada com dados únicos
      const call = {
        ...baseCall,
        date: date.toISOString(),
        leadId: `lead-${Math.floor(index / 3)}`,
        leadInfo: {
          ...baseCall.leadInfo,
          firstName,
          lastName,
          company,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`
        }
      };

      return call;
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
