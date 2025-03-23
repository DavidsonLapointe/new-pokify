
import { Call } from "@/types/calls";
import { v4 as uuidv4 } from "uuid";

export const mockCalls: Call[] = [
  {
    id: uuidv4(),
    organizationId: "org-123",
    userId: "user-123",
    fileName: "call-01.mp3",
    fileUrl: "https://example.com/calls/call-01.mp3",
    duration: "5:25",
    status: "success",
    createdAt: "2023-05-15T14:30:00Z",
    updatedAt: "2023-05-15T14:35:00Z",
    transcription: "Olá, eu sou o João da empresa XYZ. Estou ligando para falar sobre nossos serviços...",
    summary: "Cliente interessado em conhecer mais sobre os planos oferecidos.",
    analysis: {
      sentiment: {
        temperature: "hot",
        reason: "Cliente demonstrou grande interesse no produto"
      },
      keywords: ["preço", "planos", "demonstração"],
      suggestions: ["Oferecer demonstração", "Enviar tabela de preços"],
      objections: ["Preço um pouco acima do orçamento"]
    },
    leadInfo: {
      personType: "pj",
      firstName: "João",
      lastName: "Silva",
      email: "joao@example.com",
      phone: "(11) 98765-4321",
      company: "Empresa ABC",
      razaoSocial: "Empresa ABC Ltda",
      temperature: "hot",
      status: "active" // Changed from "negotiation" to "active"
    }
  },
  {
    id: uuidv4(),
    organizationId: "org-123",
    userId: "user-123",
    fileName: "call-02.mp3",
    fileUrl: "https://example.com/calls/call-02.mp3",
    duration: "6:52",
    status: "success",
    createdAt: "2023-05-16T10:15:00Z",
    updatedAt: "2023-05-16T10:22:00Z",
    transcription: "Boa tarde, meu nome é Maria da empresa ABC. Gostaria de saber mais informações sobre...",
    summary: "Cliente solicitou informações detalhadas sobre integrações disponíveis.",
    analysis: {
      sentiment: {
        temperature: "warm",
        reason: "Cliente interessado mas com ressalvas"
      },
      keywords: ["integração", "API", "implementação"],
      suggestions: ["Enviar documentação técnica", "Agendar reunião com equipe técnica"],
      objections: ["Prazo de implementação muito longo"]
    },
    leadInfo: {
      personType: "pj",
      firstName: "Maria",
      lastName: "Oliveira",
      email: "maria@example.com",
      phone: "(11) 91234-5678",
      company: "Empresa XYZ",
      razaoSocial: "Empresa XYZ S.A.",
      temperature: "warm",
      status: "active" // Changed from "qualified" to "active"
    }
  }
];
