
import { Call } from '@/types/calls';
import { randomNumber, randomDate } from './utils';

// Lista de nomes para gerar leads
const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Lucas', 'Juliana', 'Bruno', 'Camila'];
const lastNames = ['Silva', 'Oliveira', 'Santos', 'Souza', 'Ferreira', 'Costa', 'Pereira', 'Lima', 'Gomes', 'Almeida'];
const companies = ['Tech Solutions', 'Inovação Digital', 'Soluções Empresariais', 'Tecnologia Avançada', 'Sistemas Integrados', 'Consultoria Empresarial', 'Marketing Digital', 'Automação Industrial', 'Logística Expressa', 'Serviços Financeiros'];

// Gera um lead aleatório (pessoa física ou jurídica)
const generateRandomLead = (id: string): Call['leadInfo'] => {
  const isPF = Math.random() > 0.4;
  
  if (isPF) {
    return {
      personType: 'PF',
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      razaoSocial: '',
      phone: `(${randomNumber(11, 99)}) ${randomNumber(91000, 99999)}-${randomNumber(1000, 9999)}`
    };
  } else {
    return {
      personType: 'PJ',
      firstName: '',
      lastName: '',
      razaoSocial: companies[Math.floor(Math.random() * companies.length)],
      phone: `(${randomNumber(11, 99)}) ${randomNumber(91000, 99999)}-${randomNumber(1000, 9999)}`
    };
  }
};

// Gera uma chamada aleatória
const generateRandomCall = (id: string, leadId?: string): Call => {
  const callDate = randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
  const status = Math.random() > 0.1 ? 'success' : 'error';
  const emptyLead = Math.random() > 0.9;
  
  // Gera ou usa o leadId fornecido
  const actualLeadId = leadId || `lead-${Math.random().toString(36).substr(2, 9)}`;
  const leadInfo = generateRandomLead(actualLeadId);
  
  return {
    id,
    leadId: actualLeadId,
    date: callDate.toISOString(),
    duration: randomNumber(30, 900),
    status,
    emptyLead,
    leadInfo,
    audioUrl: status === 'success' ? `https://example.com/audio/${id}.mp3` : null,
    videoUrl: Math.random() > 0.7 ? `https://example.com/video/${id}.mp4` : null,
    transcriptionUrl: status === 'success' ? `https://example.com/transcription/${id}.txt` : null,
    phone: leadInfo.phone,
    crmInfo: Math.random() > 0.3 ? {
      id: `crm-${Math.random().toString(36).substr(2, 9)}`,
      source: Math.random() > 0.5 ? 'hubspot' : 'pipedrive',
      dealId: `deal-${Math.random().toString(36).substr(2, 9)}`,
      status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'][randomNumber(0, 6)],
      value: Math.random() > 0.3 ? randomNumber(1000, 50000) : null,
      updatedAt: new Date(callDate.getTime() + randomNumber(1, 48) * 60 * 60 * 1000).toISOString()
    } : null,
    analysis: status === 'success' ? {
      sentiment: ['positive', 'neutral', 'negative'][randomNumber(0, 2)],
      temperature: ['hot', 'warm', 'cold'][randomNumber(0, 2)],
      mainPoints: [
        'Interesse no produto',
        'Preocupação com preço',
        'Dúvidas técnicas',
        'Solicitou demonstração',
        'Mencionou concorrente'
      ].slice(0, randomNumber(2, 5)),
      objections: Math.random() > 0.5 ? [
        {
          text: ['Preço alto', 'Falta de funcionalidade', 'Experiência com concorrente', 'Sem orçamento disponível'][randomNumber(0, 3)],
          response: Math.random() > 0.3 ? 'Resposta adequada' : 'Resposta inadequada'
        }
      ] : [],
      nextSteps: ['Agendar reunião', 'Enviar proposta', 'Demonstração técnica', 'Seguir por email'][randomNumber(0, 3)],
      score: randomNumber(1, 10) / 10
    } : null,
    uploadedAt: callDate.toISOString(),
    uploadedBy: `user-${Math.random().toString(36).substr(2, 9)}`
  };
};

// Gera múltiplas chamadas, algumas para o mesmo lead
export const generateMockCalls = (count: number): Call[] => {
  const calls: Call[] = [];
  const leadIds: string[] = [];
  
  // Primeiro, gera alguns leads
  for (let i = 0; i < Math.floor(count * 0.7); i++) {
    leadIds.push(`lead-${Math.random().toString(36).substr(2, 9)}`);
  }
  
  // Gera as chamadas
  for (let i = 0; i < count; i++) {
    const useExistingLead = i >= leadIds.length || Math.random() > 0.7;
    const leadId = useExistingLead ? leadIds[randomNumber(0, leadIds.length - 1)] : undefined;
    
    const call = generateRandomCall(`call-${i + 1}`, leadId);
    calls.push(call);
    
    // Se for um novo lead, adiciona ao array de leads
    if (!useExistingLead) {
      leadIds.push(call.leadId);
    }
  }
  
  // Ordena por data, mais recentes primeiro
  return calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Exporta chamadas mockadas
export const mockCalls = generateMockCalls(50);
