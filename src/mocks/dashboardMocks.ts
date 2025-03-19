
import { v4 as uuidv4 } from "uuid";

export const mockDashboardStats = {
  currentMonth: {
    totalCalls: 87,
    totalLeads: 42,
    conversionRate: 48.3,
    callTime: 4680 // em segundos
  },
  previousMonth: {
    totalCalls: 65,
    totalLeads: 31,
    conversionRate: 47.7,
    callTime: 3250 // em segundos
  }
};

export const mockDailyCallsData = [
  { day: "01/06", calls: 4 },
  { day: "02/06", calls: 5 },
  { day: "03/06", calls: 3 },
  { day: "04/06", calls: 6 },
  { day: "05/06", calls: 8 },
  { day: "06/06", calls: 7 },
  { day: "07/06", calls: 5 },
  { day: "08/06", calls: 4 },
  { day: "09/06", calls: 6 },
  { day: "10/06", calls: 9 },
  { day: "11/06", calls: 7 },
  { day: "12/06", calls: 5 },
  { day: "13/06", calls: 4 },
  { day: "14/06", calls: 6 }
];

export const mockDailyLeadsData = [
  { day: "01/06", leads: 2 },
  { day: "02/06", leads: 3 },
  { day: "03/06", leads: 1 },
  { day: "04/06", leads: 4 },
  { day: "05/06", leads: 5 },
  { day: "06/06", leads: 3 },
  { day: "07/06", leads: 2 },
  { day: "08/06", leads: 1 },
  { day: "09/06", leads: 3 },
  { day: "10/06", leads: 4 },
  { day: "11/06", leads: 3 },
  { day: "12/06", leads: 2 },
  { day: "13/06", leads: 2 },
  { day: "14/06", leads: 3 }
];

export const mockObjectionsData = [
  { name: "Preço", count: 15 },
  { name: "Prazo de entrega", count: 8 },
  { name: "Funcionalidades", count: 6 },
  { name: "Suporte", count: 4 },
  { name: "Integração", count: 3 }
];

export const mockSuggestions = [
  {
    id: uuidv4(),
    suggestion: "Oferecer desconto para pagamento à vista",
    category: "pricing",
    occurrence: 12,
    impact: "high"
  },
  {
    id: uuidv4(),
    suggestion: "Destacar diferenciais em relação à concorrência",
    category: "objection",
    occurrence: 9,
    impact: "medium"
  },
  {
    id: uuidv4(),
    suggestion: "Mencionar casos de sucesso similares",
    category: "pitch",
    occurrence: 7,
    impact: "high"
  },
  {
    id: uuidv4(),
    suggestion: "Oferecer período de teste estendido",
    category: "closing",
    occurrence: 5,
    impact: "medium"
  }
];

export const mockSellersPerformance = [
  {
    id: uuidv4(),
    name: "Vendedor 1",
    calls: 32,
    leads: 18,
    conversionRate: 56.3,
    averageCallTime: 320 // em segundos
  },
  {
    id: uuidv4(),
    name: "Vendedor 2",
    calls: 28,
    leads: 13,
    conversionRate: 46.4,
    averageCallTime: 280 // em segundos
  },
  {
    id: uuidv4(),
    name: "Vendedor 3",
    calls: 27,
    leads: 11,
    conversionRate: 40.7,
    averageCallTime: 310 // em segundos
  }
];
