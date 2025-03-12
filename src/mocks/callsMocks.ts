
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
      personType: "pf",
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      razaoSocial: '',
      phone: `(${randomNumber(11, 99)}) ${randomNumber(91000, 99999)}-${randomNumber(1000, 9999)}`
    };
  } else {
    return {
      personType: "pj",
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
  const callStatus = Math.random() > 0.1 ? 'success' : 'failed';
  const emptyLead = Math.random() > 0.9;
  
  // Gera ou usa o leadId fornecido
  const actualLeadId = leadId || `lead-${Math.random().toString(36).substr(2, 9)}`;
  const leadInfo = generateRandomLead(actualLeadId);
  const durationInSeconds = randomNumber(30, 900);
  
  return {
    id,
    leadId: actualLeadId,
    date: callDate.toISOString(),
    duration: durationInSeconds.toString(),
    status: callStatus,
    emptyLead,
    leadInfo,
    audioUrl: callStatus === 'success' ? `https://example.com/audio/${id}.mp3` : null,
    videoUrl: Math.random() > 0.7 ? `https://example.com/video/${id}.mp4` : null,
    transcriptionUrl: callStatus === 'success' ? `https://example.com/transcription/${id}.txt` : null,
    phone: leadInfo.phone,
    seller: `Vendedor ${Math.floor(Math.random() * 10) + 1}`,
    mediaType: Math.random() > 0.7 ? 'video' : 'audio',
    crmInfo: Math.random() > 0.3 ? {
      funnel: `Funil ${Math.floor(Math.random() * 3) + 1}`,
      stage: ['Novo', 'Contatado', 'Qualificado', 'Proposta', 'Negociação', 'Ganho', 'Perdido'][randomNumber(0, 6)],
      lastUpdate: new Date(callDate.getTime() + randomNumber(1, 48) * 60 * 60 * 1000).toISOString()
    } : undefined,
    analysis: callStatus === 'success' ? {
      transcription: `Esta é uma transcrição simulada para a chamada ${id}...`,
      summary: `Resumo da conversa com o lead ${leadInfo.personType === 'pf' ? leadInfo.firstName : leadInfo.razaoSocial}`,
      sentiment: {
        temperature: ['cold', 'warm', 'hot'][randomNumber(0, 2)] as any,
        reason: ['Demonstrou interesse', 'Solicitou mais informações', 'Mencionou concorrentes'][randomNumber(0, 2)]
      },
      leadInfo: leadInfo
    } : undefined,
    isNewLead: Math.random() > 0.7
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
