
import { Call } from "@/types/calls";
import { v4 as uuidv4 } from "uuid";

export const mockCalls: Call[] = [
  {
    id: uuidv4(),
    organizationId: "org-123",
    userId: "user-123",
    fileName: "call-01.mp3",
    fileUrl: "https://example.com/calls/call-01.mp3",
    duration: 325, // em segundos
    status: "processed",
    createdAt: "2023-05-15T14:30:00Z",
    updatedAt: "2023-05-15T14:35:00Z",
    transcription: "Olá, eu sou o João da empresa XYZ. Estou ligando para falar sobre nossos serviços...",
    summary: "Cliente interessado em conhecer mais sobre os planos oferecidos.",
    analysis: {
      sentiment: "positive",
      keywords: ["preço", "planos", "demonstração"],
      suggestions: ["Oferecer demonstração", "Enviar tabela de preços"],
      objections: ["Preço um pouco acima do orçamento"]
    },
    leadInfo: {
      id: "lead-123",
      firstName: "João",
      lastName: "Silva",
      email: "joao@example.com",
      phone: "(11) 98765-4321",
      company: "Empresa ABC",
      personType: "pj",
      razaoSocial: "Empresa ABC Ltda",
      cnpj: "12.345.678/0001-90",
      temperature: "hot",
      status: "negotiation"
    }
  },
  {
    id: uuidv4(),
    organizationId: "org-123",
    userId: "user-123",
    fileName: "call-02.mp3",
    fileUrl: "https://example.com/calls/call-02.mp3",
    duration: 412, // em segundos
    status: "processed",
    createdAt: "2023-05-16T10:15:00Z",
    updatedAt: "2023-05-16T10:22:00Z",
    transcription: "Boa tarde, meu nome é Maria da empresa ABC. Gostaria de saber mais informações sobre...",
    summary: "Cliente solicitou informações detalhadas sobre integrações disponíveis.",
    analysis: {
      sentiment: "neutral",
      keywords: ["integração", "API", "implementação"],
      suggestions: ["Enviar documentação técnica", "Agendar reunião com equipe técnica"],
      objections: ["Prazo de implementação muito longo"]
    },
    leadInfo: {
      id: "lead-456",
      firstName: "Maria",
      lastName: "Oliveira",
      email: "maria@example.com",
      phone: "(11) 91234-5678",
      company: "Empresa XYZ",
      personType: "pj",
      razaoSocial: "Empresa XYZ S.A.",
      cnpj: "98.765.432/0001-10",
      temperature: "warm",
      status: "qualified"
    }
  }
];
