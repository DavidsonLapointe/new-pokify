
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Headphones, 
  UserRound, 
  MessageCircle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle,
  LineChart,
  Mail,
  Brain,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const AIToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState<string>("video");

  const tools = [
    {
      id: "video",
      title: "Prospecção com Vídeo",
      icon: Video,
      description: "Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.",
      locked: false,
      detailedDescription: "Crie vídeos personalizados para seus leads utilizando IA. O sistema pode gerar um roteiro baseado no perfil do lead e automaticamente criar vídeos com seu avatar digital.",
      actionLabel: "Criar novo vídeo",
      actionIcon: Video,
      status: "Ativo",
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
      locked: true,
      detailedDescription: "Configure um assistente virtual para atender os contatos recebidos através do seu site. A IA pode qualificar leads, responder perguntas comuns e agendar demonstrações.",
      actionLabel: "Configurar atendente",
      actionIcon: Headphones,
      status: "Em breve",
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
      locked: false,
      detailedDescription: "Carregue gravações de chamadas de vendas e obtenha análises detalhadas sobre objeções, sentimento do cliente, oportunidades perdidas e sugestões para melhorar a conversão.",
      actionLabel: "Analisar chamada",
      actionIcon: LineChart,
      status: "Ativo",
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
      locked: true,
      detailedDescription: "Configure sequências de emails personalizados que serão enviados automaticamente aos seus leads com base no seu perfil e comportamento, aumentando o engajamento.",
      actionLabel: "Configurar campanha",
      actionIcon: Mail,
      status: "Em breve",
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
      locked: false,
      detailedDescription: "Um assistente inteligente que ajuda a encontrar e qualificar leads potenciais, automatiza a pesquisa e preparação para contatos iniciais, e sugere abordagens personalizadas.",
      actionLabel: "Iniciar assistente",
      actionIcon: Brain,
      status: "Ativo",
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Ferramentas de IA</h1>
        <p className="text-gray-500">Ferramentas de IA para otimizar seu processo de vendas</p>
      </div>

      <div>
        <p className="text-gray-600 mb-4">Escolha uma das ferramentas abaixo para otimizar seu processo de vendas:</p>
        
        <div className="relative">
          <div className="flex items-center space-x-4 overflow-x-auto py-4 px-1">
            <button 
              className="absolute left-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Deslizar para esquerda"
            >
              <ChevronLeft size={20} />
            </button>
            
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className={`w-[180px] h-[120px] flex-shrink-0 cursor-pointer transition-all ${
                  selectedTool === tool.id ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white'
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center h-full space-y-2">
                  <div className={`p-2 rounded-md ${selectedTool === tool.id ? 'text-[#9b87f5]' : 'text-gray-500'}`}>
                    {tool.locked && (
                      <div className="absolute top-2 right-2">
                        <span className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </span>
                      </div>
                    )}
                    <tool.icon size={28} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{tool.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <button 
              className="absolute right-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Deslizar para direita"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detalhes da ferramenta selecionada */}
      {tools.map((tool) => (
        selectedTool === tool.id && (
          <Card key={`details-${tool.id}`} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <tool.icon className="text-[#9b87f5]" size={24} />
              <h2 className="text-xl font-semibold">{tool.title}</h2>
              <Badge variant="outline" className={tool.locked ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"} ml-auto="true">
                {tool.locked ? "Em breve" : "Ativo"}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-5 text-sm text-left">
              {tool.description}
            </p>

            <div className="bg-[#F8F8FB] p-5 rounded-lg mb-6 shadow-sm">
              <div className="mb-5">
                <h3 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                  <HelpCircle size={18} className="mr-2" />
                  Como Funciona
                </h3>
                <ul className="space-y-2">
                  {tool.howItWorks.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <PlayCircle size={16} className="text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                  <CheckCircle2 size={18} className="mr-2" />
                  Benefícios
                </h3>
                <ul className="space-y-2">
                  {tool.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              size="sm"
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] flex items-center justify-center gap-2 py-5"
              disabled={tool.locked}
            >
              <tool.actionIcon size={18} />
              <span>{tool.actionLabel}</span>
              <ArrowRight size={18} />
            </Button>
          </Card>
        )
      ))}
    </div>
  );
};

export default AIToolsPage;
