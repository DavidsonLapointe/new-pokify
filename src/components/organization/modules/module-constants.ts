
import { Tool } from "./types";
import { 
  Video,
  Headphones,
  UserRound,
  MessageCircle,
  ShieldCheck
} from "lucide-react";

export const MOCK_TOOLS: Tool[] = [
  {
    id: "video",
    title: "Prospecção com Vídeo",
    icon: Video,
    description: "Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.",
    status: "setup",
    detailedDescription: "Crie vídeos personalizados para seus leads utilizando IA. O sistema pode gerar um roteiro baseado no perfil do lead e automaticamente criar vídeos com seu avatar digital.",
    price: 199.90,
    credits: 5,
    badgeLabel: "Em Setup",
    howItWorks: [
      "Importação de dados do lead a partir do seu CRM",
      "Geração de roteiro personalizado com base no perfil",
      "Criação automática de vídeo com seu avatar digital",
      "Entrega por e-mail ou WhatsApp diretamente ao cliente"
    ],
    benefits: [
      "Aumento de 35% na taxa de resposta em comparação a e-mails convencionais",
      "Redução de tempo na criação de conteúdos personalizados",
      "Maior engajamento com os leads e clientes potenciais",
      "Personalização em escala sem perder qualidade"
    ]
  },
  {
    id: "inbound",
    title: "Atendente Inbound",
    icon: Headphones,
    description: "Atendimento automatizado para leads inbound com IA conversacional.",
    status: "not_contracted",
    detailedDescription: "Configure um assistente virtual para atender os contatos recebidos através do seu site. A IA pode qualificar leads, responder perguntas comuns e agendar demonstrações.",
    price: 149.90,
    credits: 3,
    badgeLabel: "Não contratada",
    howItWorks: [
      "Instalação de widget de chat no seu website",
      "Configuração de respostas para perguntas frequentes",
      "Integração com seu calendário para agendamentos",
      "Qualificação automática dos leads"
    ],
    benefits: [
      "Atendimento 24/7 sem necessidade de equipe disponível",
      "Qualificação de leads automatizada antes do contato humano",
      "Redução no tempo de resposta inicial para clientes",
      "Aumento na conversão de visitantes em leads qualificados"
    ]
  },
  {
    id: "call",
    title: "Análise de Call",
    icon: UserRound,
    description: "Análise automática de chamadas para identificar padrões e insights.",
    status: "configured",
    detailedDescription: "Carregue gravações de chamadas de vendas e obtenha análises detalhadas sobre objeções, sentimento do cliente, oportunidades perdidas e sugestões para melhorar a conversão.",
    price: 249.90,
    credits: 10,
    badgeLabel: "Configurada",
    howItWorks: [
      "Upload da gravação da chamada na plataforma",
      "Processamento e transcrição automática do áudio",
      "Análise de sentimento, objeções e oportunidades",
      "Geração de relatório com pontos de melhoria"
    ],
    benefits: [
      "Identificação das principais objeções dos clientes",
      "Feedback objetivo sobre desempenho nas chamadas",
      "Sugestões personalizadas para aumentar conversão",
      "Treinamento de equipe baseado em dados reais"
    ]
  },
  {
    id: "nutrition",
    title: "Nutrição de leads (MKT)",
    icon: MessageCircle,
    description: "Automação de campanhas de nutrição de leads com conteúdo personalizado.",
    status: "coming_soon",
    detailedDescription: "Configure sequências de emails personalizados que serão enviados automaticamente aos seus leads com base no seu perfil e comportamento, aumentando o engajamento.",
    price: 129.90,
    credits: 2,
    badgeLabel: "Em breve",
    howItWorks: [
      "Segmentação dos leads por perfil e comportamento",
      "Criação de sequências de conteúdo personalizado",
      "Envio automático baseado em gatilhos de comportamento",
      "Análise de engajamento e ajustes contínuos"
    ],
    benefits: [
      "Redução de 45% no tempo de preparação de campanhas",
      "Aumento na taxa de conversão do funil de vendas",
      "Maior engajamento com conteúdo relevante personalizado",
      "Escala nas ações de marketing mesmo com equipe pequena"
    ]
  },
  {
    id: "assistant",
    title: "Assistente de Prospecção",
    icon: ShieldCheck,
    description: "Assistente virtual para auxiliar na prospecção de novos clientes.",
    status: "contracted",
    detailedDescription: "Um assistente inteligente que ajuda a encontrar e qualificar leads potenciais, automatiza a pesquisa e preparação para contatos iniciais, e sugere abordagens personalizadas.",
    price: 179.90,
    credits: 7,
    badgeLabel: "Contratada",
    howItWorks: [
      "Pesquisa automática de informações sobre empresas-alvo",
      "Elaboração de abordagens personalizadas para cada lead",
      "Sugestão de melhores canais e horários para contato",
      "Preparação de material de apoio para reuniões iniciais"
    ],
    benefits: [
      "Aumento de 28% na taxa de agendamento de reuniões",
      "Redução do tempo de pesquisa e preparação para contatos",
      "Abordagens mais assertivas baseadas em dados",
      "Maior produtividade do time comercial"
    ]
  }
];
