
import { Call } from "@/types/calls";

const firstNames = ["Carlos", "Ana", "João", "Maria", "Pedro", "Julia", "Lucas", "Beatriz", "Rafael", "Fernanda"];
const lastNames = ["Silva", "Santos", "Oliveira", "Pereira", "Rodrigues", "Lima", "Costa", "Ferreira", "Almeida", "Souza"];
const companies = ["Tech Solutions", "Inovação Digital", "Empresa XYZ", "Comércio ABC", "Indústria 123"];

// Base template para uma chamada
const baseCall: Partial<Call> = {
  duration: "2:35",
  status: "success",
  seller: "João Silva",
  audioUrl: "https://example.com/audio1.mp3",
  mediaType: "audio",
  analysis: {
    transcription: "Vendedor: Olá, bom dia! Em que posso ajudar?\nCliente: Bom dia! Gostaria de saber mais sobre os planos empresariais...",
    summary: "Cliente demonstrou interesse nos planos empresariais, especialmente no módulo de gestão de vendas.",
    sentiment: {
      temperature: "hot",
      reason: "Cliente demonstrou forte interesse no produto",
    },
    leadInfo: {
      personType: "pf",
      firstName: "Carlos",
      lastName: "Silva",
      email: "carlos.silva@empresa.com.br",
      phone: "(11) 98765-4321",
      company: "Empresa XYZ Ltda",
      position: "Diretor Comercial",
      budget: "R$ 5.000 - R$ 10.000 / mês",
      interests: ["Gestão de Vendas", "Automação", "Relatórios"],
      painPoints: [
        "Dificuldade em acompanhar performance dos vendedores",
        "Perda de oportunidades por falta de follow-up",
      ],
      nextSteps: "Agendar demonstração técnica",
    },
  },
  crmInfo: {
    funnel: "Vendas",
    stage: "Qualificação"
  }
};

// Função para gerar uma nova chamada com dados únicos
const generateCall = (id: string, leadId: string, date: Date): Call => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const phone = `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com.br`;

  return {
    ...baseCall,
    id,
    leadId,
    date: date.toISOString(),
    phone,
    leadInfo: {
      personType: "pf",
      firstName,
      lastName,
      email,
      phone,
      company,
      position: "Diretor",
      razaoSocial: company
    }
  } as Call;
};

// Gerar 18 leads com chamadas
export const mockCalls: Call[] = Array.from({ length: 18 }).map((_, index) => {
  const leadId = `lead_${index + 1}`;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 dias
  
  return generateCall(`call_${index + 1}`, leadId, date);
});

