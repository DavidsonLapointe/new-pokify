
import { Lead } from '@/types/leads';
import { randomNumber, randomDate } from './utils';

// Gera leads mockados
export const generateMockLeads = (count: number): Lead[] => {
  const leads: Lead[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos'][randomNumber(0, 4)];
    
    leads.push({
      id: `lead-${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName: ['Silva', 'Oliveira', 'Santos', 'Souza', 'Ferreira'][randomNumber(0, 4)],
      contactType: Math.random() > 0.5 ? "phone" : "email",
      contactValue: Math.random() > 0.5 
        ? `(${randomNumber(11, 99)}) ${randomNumber(91000, 99999)}-${randomNumber(1000, 9999)}`
        : `contato${randomNumber(1, 1000)}@gmail.com`,
      status: ["pending", "contacted", "failed"][randomNumber(0, 2)],
      createdAt: randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)).toISOString(),
      callCount: randomNumber(0, 5),
      calls: Array.from({ length: randomNumber(0, 3) }, (_, j) => ({
        id: `call-${i}-${j}`,
        date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(),
        duration: `${randomNumber(1, 15)}:${randomNumber(10, 59)}`,
        status: Math.random() > 0.2 ? "success" : "failed"
      })),
      crmInfo: Math.random() > 0.4 ? {
        funnel: `Funil ${randomNumber(1, 3)}`,
        stage: `Etapa ${randomNumber(1, 5)}`
      } : undefined
    });
  }
  
  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Exporta leads mockados
export const mockLeads = generateMockLeads(100);
