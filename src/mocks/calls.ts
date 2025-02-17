import { Call } from "@/types/calls";

export const mockCalls: Call[] = [
  {
    id: "1",
    leadId: "lead_1",
    date: "2024-02-20T14:30:00",
    phone: "(11) 98765-4321",
    duration: "2:35",
    status: "success",
    seller: "João Silva",
    audioUrl: "https://example.com/audio1.mp3",
    mediaType: "audio",
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
        "Processo manual de geração de relatórios",
      ],
      nextSteps: "Agendar demonstração técnica com a equipe de TI para a próxima semana",
    },
    analysis: {
      transcription: "Vendedor: Olá, bom dia! Em que posso ajudar?\nCliente: Bom dia! Gostaria de saber mais sobre os planos empresariais...",
      summary: "Cliente demonstrou interesse nos planos empresariais, especialmente no módulo de gestão de vendas. Possui uma equipe de 15 vendedores e busca melhorar o processo de acompanhamento de leads.",
      sentiment: {
        temperature: "hot",
        reason: "Cliente demonstrou forte interesse no produto, fez perguntas específicas sobre funcionalidades e mencionou orçamento disponível. Solicita uma proposta comercial com urgência.",
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
          "Processo manual de geração de relatórios",
        ],
        nextSteps: "Agendar demonstração técnica com a equipe de TI para a próxima semana",
      },
    },
    crmInfo: {
      funnel: "Vendas",
      stage: "Qualificação"
    }
  },
  {
    id: "2",
    leadId: "lead_1",
    date: "2024-02-21T15:45:00",
    phone: "(11) 98765-4321",
    duration: "3:15",
    status: "success",
    seller: "Maria Santos",
    audioUrl: "https://example.com/video1.mp4",
    mediaType: "video",
    leadInfo: {
      personType: "pf",
      firstName: "Carlos",
      lastName: "Silva",
      email: "carlos.silva@empresa.com.br",
      phone: "(11) 98765-4321",
      company: "Empresa XYZ Ltda",
      position: "Diretor Comercial"
    },
    analysis: {
      transcription: "Vendedor: Olá, boa tarde! Vamos continuar nossa demonstração...\nCliente: Perfeito, gostaria de ver as funcionalidades de relatório...",
      summary: "Realizada demonstração detalhada do módulo de relatórios. Cliente mostrou-se muito satisfeito com as possibilidades de customização.",
      sentiment: {
        temperature: "hot",
        reason: "Cliente demonstrou entusiasmo durante a demonstração e sinalizou interesse em avançar para a proposta comercial.",
      },
      leadInfo: {
        personType: "pf",
        firstName: "Carlos",
        lastName: "Silva",
        email: "carlos.silva@empresa.com.br",
        phone: "(11) 98765-4321",
        company: "Empresa XYZ Ltda",
        position: "Diretor Comercial"
      },
    }
  },
  {
    id: "3",
    leadId: "lead_1",
    date: "2024-02-22T10:20:00",
    phone: "(11) 98765-4321",
    duration: "0:45",
    status: "failed",
    seller: "Pedro Oliveira",
    audioUrl: "https://example.com/audio3.mp3",
    mediaType: "audio",
    leadInfo: {
      personType: "pf",
      firstName: "Carlos",
      lastName: "Silva",
      email: "carlos.silva@empresa.com.br",
      phone: "(11) 98765-4321",
      company: "Empresa XYZ Ltda",
      position: "Diretor Comercial"
    }
  },
  {
    id: "4",
    leadId: "lead_1",
    date: "2024-02-23T09:00:00",
    phone: "(11) 98765-4321",
    duration: "1:30",
    status: "failed",
    seller: "Ana Beatriz",
    audioUrl: "https://example.com/audio4.mp3",
    mediaType: "audio",
    leadInfo: {
      personType: "pf",
      firstName: "Carlos",
      lastName: "Silva",
      email: "carlos.silva@empresa.com.br",
      phone: "(11) 98765-4321",
      company: "Empresa XYZ Ltda",
      position: "Diretor Comercial"
    }
  }
];
