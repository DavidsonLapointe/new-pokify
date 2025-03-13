import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Clock, 
  CreditCard,
  MoreVertical,
  Trash2,
  Video,
  Headphones,
  UserRound,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Status da ferramenta
type ToolStatus = "not_contracted" | "contracted" | "configured" | "coming_soon";

// Interface para as ferramentas
interface Tool {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  status: ToolStatus;
  detailedDescription: string;
  price: number;
  badgeLabel: string;
  howItWorks: string[];
  benefits: string[];
}

const OrganizationModules = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [action, setAction] = useState<"contract" | "cancel" | null>(null);
  const [selectedToolDetails, setSelectedToolDetails] = useState<Tool | null>(null);

  const tools: Tool[] = [
    {
      id: "video",
      title: "Prospecção com Vídeo",
      icon: Video,
      description: "Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.",
      status: "contracted",
      detailedDescription: "Crie vídeos personalizados para seus leads utilizando IA. O sistema pode gerar um roteiro baseado no perfil do lead e automaticamente criar vídeos com seu avatar digital.",
      price: 199.90,
      badgeLabel: "Contratada",
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
  
  // Inicializa com o primeiro módulo selecionado ao carregar a página
  useEffect(() => {
    setSelectedToolDetails(tools[0]);
  }, []);

  const handleContractTool = (toolId: string) => {
    setSelectedTool(toolId);
    setAction("contract");
    setIsConfirmDialogOpen(true);
  };

  const handleCancelTool = (toolId: string) => {
    setSelectedTool(toolId);
    setAction("cancel");
    setIsConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedTool || !action) return;
    
    const tool = tools.find(t => t.id === selectedTool);
    if (!tool) return;

    if (action === "contract") {
      toast.success(`Módulo "${tool.title}" contratado com sucesso!`);
    } else {
      toast.success(`Módulo "${tool.title}" cancelado com sucesso!`);
    }

    setIsConfirmDialogOpen(false);
    setSelectedTool(null);
    setAction(null);
  };

  // Função para retornar o ícone de status apropriado e seu tooltip
  const getStatusInfo = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return { 
          icon: <Lock size={18} className="text-red-500" />,
          tooltip: "Módulo não contratado"
        };
      case "contracted": 
        return { 
          icon: <AlertTriangle size={18} className="text-yellow-500" />,
          tooltip: "Módulo contratado, mas ainda não configurado"
        };
      case "configured": 
        return { 
          icon: <CheckCircle2 size={18} className="text-green-500" />,
          tooltip: "Módulo contratado e configurado"
        };
      case "coming_soon":
        return { 
          icon: <Clock size={18} className="text-gray-500" />,
          tooltip: "Em breve disponível"
        };
    }
  };

  // Formatação de preço em formato brasileiro
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para mostrar os detalhes da ferramenta
  const showToolDetails = (tool: Tool) => {
    setSelectedToolDetails(tool);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Módulos do Sistema</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os módulos de IA disponíveis para sua empresa
          </p>
        </div>

        <div className="relative mx-1">
          <Carousel
            opts={{
              align: "start",
              loop: false // Altere para false para parar no primeiro e último registro
            }}
            className="w-full"
          >
            <CarouselContent>
              {tools.map((tool) => {
                const statusInfo = getStatusInfo(tool.status);
                const isSelected = selectedToolDetails?.id === tool.id;
                
                return (
                  <CarouselItem key={tool.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Card 
                      className={`border-t-4 border-[#9b87f5] hover:shadow-md transition-shadow h-full cursor-pointer ${isSelected ? 'ring-2 ring-[#9b87f5]' : ''}`}
                      onClick={() => showToolDetails(tool)} // Adicionando onClick no card inteiro
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#F1F0FB] rounded-md text-[#9b87f5]">
                              <tool.icon size={20} />
                            </div>
                            <h3 className="text-base font-semibold">{tool.title}</h3>
                          </div>

                          <Tooltip>
                            <TooltipTrigger>
                              {statusInfo.icon}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{statusInfo.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>

                          {(tool.status === "contracted" || tool.status === "configured") && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 ml-1">
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-red-600 flex items-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Evita que o clique propague para o card
                                    handleCancelTool(tool.id);
                                  }}
                                >
                                  <Trash2 size={14} />
                                  <span>Cancelar módulo</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4 text-xs">
                          {tool.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-lg text-[#6E59A5]">
                            {formatPrice(tool.price)}<span className="text-xs text-gray-500">/mês</span>
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`w-full justify-between text-xs ${isSelected ? "bg-primary-lighter text-primary" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation(); // Evita que o clique propague para o card
                              showToolDetails(tool);
                            }}
                          >
                            Ver Detalhes
                            {isSelected ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </Button>

                          {tool.status === "not_contracted" && (
                            <Button 
                              className="w-full bg-[#9b87f5] hover:bg-[#8a76e5] flex items-center justify-center gap-2 text-xs"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Evita que o clique propague para o card
                                handleContractTool(tool.id);
                              }}
                            >
                              <CreditCard size={14} />
                              Contratar Módulo
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>

        {selectedToolDetails && (
          <div className="mt-6 bg-white rounded-lg border shadow-md animate-fadeIn overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-[#F1F0FB] to-white">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#9b87f5] rounded-full text-white">
                  <selectedToolDetails.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1F2C]">{selectedToolDetails.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-[#6E59A5] font-semibold">
                      {formatPrice(selectedToolDetails.price)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/mês</span>
                    <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                      selectedToolDetails.status === "configured" 
                        ? "bg-green-100 text-green-800"
                        : selectedToolDetails.status === "contracted"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedToolDetails.status === "not_contracted"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedToolDetails.status === "configured" 
                        ? "Configurada" 
                        : selectedToolDetails.status === "contracted"
                        ? "Contratada"
                        : selectedToolDetails.status === "not_contracted"
                        ? "Não contratada"
                        : "Em breve"}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedToolDetails(null)}
                className="h-9 w-9 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="p-6">
              {/* Descrição detalhada ocupando toda a largura */}
              <div className="mb-6 p-5 bg-[#F8F9FB] rounded-lg border border-gray-100">
                <h4 className="text-lg font-medium mb-3 flex items-center text-[#403E43]">
                  <span className="bg-[#9b87f5] w-1 h-5 rounded mr-2 inline-block"></span>
                  Descrição Detalhada
                </h4>
                <p className="text-gray-600 leading-relaxed">{selectedToolDetails.detailedDescription}</p>
              </div>
              
              {/* Grid com benefícios e como funciona lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-6 p-5 bg-[#F8F9FB] rounded-lg border border-gray-100 h-full">
                  <h4 className="text-lg font-medium mb-4 flex items-center text-[#403E43]">
                    <span className="bg-[#9b87f5] w-1 h-5 rounded mr-2 inline-block"></span>
                    Benefícios
                  </h4>
                  <ul className="space-y-3">
                    {selectedToolDetails.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm transition-transform hover:translate-x-1">
                        <CheckCircle2 size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6 p-5 bg-[#F8F9FB] rounded-lg border border-gray-100 h-full">
                  <h4 className="text-lg font-medium mb-4 flex items-center text-[#403E43]">
                    <span className="bg-[#9b87f5] w-1 h-5 rounded mr-2 inline-block"></span>
                    Como Funciona
                  </h4>
                  <ul className="space-y-4">
                    {selectedToolDetails.howItWorks.map((step, idx) => (
                      <li key={idx} className="relative pl-10 pb-5 border-l-2 border-[#E5DEFF] last:border-0 last:pb-0">
                        <div className="absolute left-[-13px] top-0 bg-[#9b87f5] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md">
                          {idx + 1}
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <span className="text-gray-700">{step}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Removi o contêiner com retângulo vermelho conforme solicitado */}
            </div>
          </div>
        )}

        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {action === "contract" ? "Contratar Módulo" : "Cancelar Módulo"}
              </DialogTitle>
            </DialogHeader>
            
            {selectedTool && (
              <div className="py-4">
                <p className="mb-6">
                  {action === "contract" 
                    ? `Você está prestes a contratar o módulo "${tools.find(t => t.id === selectedTool)?.title}". O valor de ${formatPrice((tools.find(t => t.id === selectedTool)?.price || 0))} será adicionado à sua fatura mensal.`
                    : `Você está prestes a cancelar o módulo "${tools.find(t => t.id === selectedTool)?.title}". Este módulo ficará indisponível no final do período de faturamento atual.`
                  }
                </p>
                
                <p className="text-sm text-gray-500">
                  {action === "contract"
                    ? "Ao confirmar, você concorda com os termos de uso deste módulo."
                    : "Ao cancelar, você perderá acesso a todas as funcionalidades deste módulo."
                  }
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={confirmAction}
                className={action === "contract" ? "bg-[#9b87f5] hover:bg-[#8a76e5]" : ""}
                variant={action === "cancel" ? "destructive" : "default"}
              >
                {action === "contract" ? "Confirmar Contratação" : "Confirmar Cancelamento"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default OrganizationModules;
