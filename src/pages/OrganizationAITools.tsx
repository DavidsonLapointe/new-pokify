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
  ArrowRight,
  Lock,
  CreditCard,
  Settings,
  Edit,
  AlertTriangle,
  Zap,
  Clock,
  RotateCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Status da ferramenta
type ToolStatus = "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";

// Interface para as ferramentas
interface Tool {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  status: ToolStatus;
  detailedDescription: string;
  actionLabel: string;
  actionIcon: React.ElementType;
  badgeLabel: string;
  howItWorks: string[];
  benefits: string[];
  executeLabel: string;
  executeIcon: React.ElementType;
  price: number;
  credits?: number;
}

const AIToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState<string>("video");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [currentConfigTool, setCurrentConfigTool] = useState<string>("");
  const [currentExecuteTool, setCurrentExecuteTool] = useState<string>("");

  const tools: Tool[] = [
    {
      id: "video",
      title: "Prospecção com Vídeo",
      icon: Video,
      description: "Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.",
      status: "setup",
      detailedDescription: "Crie vídeos personalizados para seus leads utilizando IA. O sistema pode gerar um roteiro baseado no perfil do lead e automaticamente criar vídeos com seu avatar digital.",
      actionLabel: "Aguardando setup",
      actionIcon: RotateCw,
      badgeLabel: "Em Setup",
      executeLabel: "Criar vídeo personalizado",
      executeIcon: Zap,
      price: 150,
      credits: 3,
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
      actionLabel: "Contratar ferramenta",
      actionIcon: CreditCard,
      badgeLabel: "Não contratada",
      executeLabel: "Configurar atendente virtual",
      executeIcon: Headphones,
      price: 100,
      credits: 2,
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
      actionLabel: "Editar configuração",
      actionIcon: Edit,
      badgeLabel: "Configurada",
      executeLabel: "Analisar chamada",
      executeIcon: PlayCircle,
      price: 75,
      credits: 1,
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
      actionLabel: "Em breve",
      actionIcon: Clock,
      badgeLabel: "Em breve",
      executeLabel: "Criar campanha de nutrição",
      executeIcon: Mail,
      price: 200,
      credits: 4,
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
      status: "configured",
      detailedDescription: "Um assistente inteligente que ajuda a encontrar e qualificar leads potenciais, automatiza a pesquisa e preparação para contatos iniciais, e sugere abordagens personalizadas.",
      actionLabel: "Configurar ferramenta",
      actionIcon: Settings,
      badgeLabel: "Contratada",
      executeLabel: "Buscar leads potenciais",
      executeIcon: Brain,
      price: 125,
      credits: 2,
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

  // Filtrar apenas as ferramentas com status "configured"
  const configuredTools = tools.filter(tool => tool.status === "configured");

  const getToolById = (id: string) => {
    return tools.find(tool => tool.id === id) || tools[0];
  };

  const handleToolAction = (toolId: string) => {
    const tool = getToolById(toolId);
    
    if (tool.status === "not_contracted") {
      // Lógica para contratação
      console.log("Iniciando contratação da ferramenta:", toolId);
    } else if (tool.status !== "coming_soon" && tool.status !== "setup") {
      // Abrir modal de configuração apenas se não for "Em breve" ou "Em Setup"
      setCurrentConfigTool(toolId);
      setIsConfigModalOpen(true);
    }
  };

  const handleToolExecution = (toolId: string) => {
    const tool = getToolById(toolId);
    
    if (tool.status === "not_contracted" || tool.status === "coming_soon" || tool.status === "setup") {
      // Não permitir execução de ferramentas não contratadas, em breve ou em setup
      return;
    }
    
    // Abrir modal de execução
    setCurrentExecuteTool(toolId);
    setIsExecuteModalOpen(true);
    
    console.log("Executando ferramenta:", toolId);
  };

  // Função para retornar o ícone de status apropriado
  const getStatusIcon = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return <Lock size={16} className="text-red-500" />;
      case "contracted": 
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case "configured": 
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "coming_soon":
        return <Clock size={16} className="text-gray-500" />;
      case "setup":
        return <RotateCw size={16} className="text-blue-500" />;
    }
  };

  // Função para retornar a cor de fundo do badge baseado no status
  const getBadgeClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-700";
      case "contracted": 
        return "bg-yellow-100 text-yellow-700";
      case "configured": 
        return "bg-green-100 text-green-700";
      case "coming_soon":
        return "bg-gray-100 text-gray-700";
      case "setup":
        return "bg-blue-100 text-blue-700";
    }
  };

  // Função atualizada para retornar a cor do botão baseado no status
  const getButtonClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-600 hover:bg-red-700 text-white";
      case "contracted": 
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "configured": 
        return "bg-green-600 hover:bg-green-700 text-white";
      case "coming_soon":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "setup":
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Ferramentas de IA</h1>
        <p className="text-gray-500">Selecione abaixo uma ferramenta de IA para otimizar seu processo operacional:</p>
      </div>

      <div>
        <div className="relative">
          <div className="flex items-center space-x-4 overflow-x-auto py-4 px-1">
            <button 
              className="absolute left-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Deslizar para esquerda"
            >
              <ChevronLeft size={20} />
            </button>
            
            {configuredTools.map((tool) => (
              <Card 
                key={tool.id}
                className={`w-[180px] h-[120px] flex-shrink-0 cursor-pointer transition-all ${
                  selectedTool === tool.id ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white'
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center h-full space-y-2 relative">
                  <div className="absolute top-2 right-2">
                    {getStatusIcon(tool.status)}
                  </div>
                  <div className={`p-2 rounded-md ${selectedTool === tool.id ? 'text-[#9b87f5]' : 'text-gray-400'}`}>
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

      {configuredTools.map((tool) => (
        selectedTool === tool.id && (
          <Card key={`details-${tool.id}`} className="p-5 bg-[#F8F8FB]">
            <div className="flex items-center gap-2 mb-4">
              <tool.icon className="text-[#9b87f5]" size={24} />
              <h2 className="text-xl font-semibold">{tool.title}</h2>
              <Badge variant="outline" className={getBadgeClass(tool.status)}>
                {tool.badgeLabel}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-3 text-sm text-left">
              {tool.detailedDescription}
            </p>
            
            {/* Informação de custo de execução */}
            <div className="mb-4 flex items-center text-sm font-medium">
              <span className="mr-2 text-[#9b87f5]">Custo de execução:</span>
              <span className="text-gray-700">{tool.credits} créditos (R$ {tool.price.toFixed(2)})</span>
            </div>

            {/* Seções "Benefícios" e "Como Funciona" com a ordem invertida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Seção Benefícios - Agora à esquerda */}
              <div className="bg-white p-5 rounded-lg shadow-sm h-full">
                <h3 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                  <CheckCircle2 size={18} className="mr-2" />
                  Benefícios
                </h3>
                <ul className="space-y-2">
                  {tool.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-left">
                      <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-left">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Seção Como Funciona - Agora à direita */}
              <div className="bg-white p-5 rounded-lg shadow-sm h-full">
                <h3 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                  <HelpCircle size={18} className="mr-2" />
                  Como Funciona
                </h3>
                <ul className="space-y-2">
                  {tool.howItWorks.map((item, index) => (
                    <li key={index} className="flex items-start text-sm text-left">
                      <PlayCircle size={16} className="text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-left">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex items-center justify-center gap-2 bg-[#9b87f5] hover:bg-[#8a76e5] px-4"
                onClick={() => handleToolExecution(tool.id)}
              >
                <tool.executeIcon size={18} />
                <span>{tool.executeLabel}</span>
              </Button>
            </div>
          </Card>
        )
      ))}

      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentConfigTool && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const ToolIcon = getToolById(currentConfigTool).icon;
                    return <ToolIcon className="text-[#9b87f5]" size={18} />;
                  })()}
                  Configurar {getToolById(currentConfigTool).title}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600 mb-5">
              Aqui você pode configurar as opções específicas desta ferramenta de IA para personalizar seu funcionamento de acordo com suas necessidades.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="cancel" onClick={() => setIsConfigModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsConfigModalOpen(false)}>
                Salvar Configurações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExecuteModalOpen} onOpenChange={setIsExecuteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentExecuteTool && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const ToolIcon = getToolById(currentExecuteTool).executeIcon;
                    return <ToolIcon className="text-[#9b87f5]" size={18} />;
                  })()}
                  {getToolById(currentExecuteTool).executeLabel}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600 mb-5">
              Selecione um lead para executar esta ferramenta de IA. A ferramenta será aplicada usando os dados do lead selecionado.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="cancel" onClick={() => setIsExecuteModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsExecuteModalOpen(false)}>
                Executar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIToolsPage;
