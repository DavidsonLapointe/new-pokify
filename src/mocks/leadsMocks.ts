
import { Lead } from '@/types';
import { randomNumber, randomDate } from './utils';

// Nomes brasileiros para leads
const firstNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Mariana', 'José', 'Fernanda', 
  'Lucas', 'Amanda', 'Rodrigo', 'Juliana', 'Rafael', 'Paula', 'Luiz', 'Camila',
  'Roberto', 'Beatriz', 'Gustavo', 'Letícia', 'Marcos', 'Natália', 'Paulo', 'Larissa',
  'Ricardo', 'Sandra', 'Fernando', 'Patrícia', 'André', 'Débora', 'Márcio', 'Carolina'
];

const lastNames = [
  'Silva', 'Oliveira', 'Santos', 'Souza', 'Ferreira', 'Pereira', 'Almeida', 'Costa',
  'Rodrigues', 'Martins', 'Carvalho', 'Gomes', 'Ribeiro', 'Alves', 'Monteiro', 'Mendes',
  'Barbosa', 'Lopes', 'Campos', 'Amaral', 'Moreira', 'Cardoso', 'Teixeira', 'Lima',
  'Cavalcanti', 'Correia', 'Dias', 'Azevedo', 'Nascimento', 'Moura', 'Cunha', 'Freitas'
];

// Gera leads mockados
export const generateMockLeads = (count: number): Lead[] => {
  const leads: Lead[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[randomNumber(0, firstNames.length - 1)];
    const lastName = lastNames[randomNumber(0, lastNames.length - 1)];
    const statuses: ("pending" | "contacted" | "failed")[] = ["pending", "contacted", "failed"];
    
    // Gera uma data nos últimos 6 meses
    const createdAtDate = randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
    
    // Mais chamadas para leads mais antigos
    const callCount = Math.max(1, Math.floor((Date.now() - createdAtDate.getTime()) / (15 * 24 * 60 * 60 * 1000)));
    
    // Array de chamadas
    const calls = Array.from({ length: randomNumber(0, callCount) }, (_, j) => {
      // Chamadas mais recentes que a data de criação do lead
      const callDate = randomDate(new Date(createdAtDate.getTime() + j * 24 * 60 * 60 * 1000));
      
      return {
        id: `call-${i}-${j}`,
        date: callDate.toISOString(),
        duration: `${randomNumber(1, 15)}:${randomNumber(10, 59)}`,
        status: Math.random() > 0.2 ? "success" : "failed"
      }
    });
    
    // 60% dos leads têm informações de CRM
    const hasCrmInfo = Math.random() > 0.4;
    
    leads.push({
      id: `lead-${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName,
      contactType: Math.random() > 0.5 ? "phone" : "email",
      contactValue: Math.random() > 0.5 
        ? `(${randomNumber(11, 99)}) ${randomNumber(91000, 99999)}-${randomNumber(1000, 9999)}`
        : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(1, 99)}@gmail.com`,
      status: statuses[randomNumber(0, 2)],
      createdAt: createdAtDate.toISOString(),
      callCount: calls.length,
      calls: calls,
      crmInfo: hasCrmInfo ? {
        funnel: `Funil ${randomNumber(1, 3)}`,
        stage: `Etapa ${randomNumber(1, 5)}`
      } : undefined
    });
  }
  
  // Ordenação: mais recente primeiro
  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Exporta leads mockados especificamente para a Organização 1 Ltda
export const leadsOrganizacao1 = generateMockLeads(32);

// Exporta leads mockados gerais
export const mockLeads = generateMockLeads(100);
