import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link } from "@/components/ui/link";
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
  X,
  HelpCircle
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
import { Textarea } from "@/components/ui/textarea";

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

interface CancelModuleFormValues {
  moduleId: string;
  reason: string;
}

const OrganizationModules = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [action, setAction] = useState<"contract" | "cancel" | null>(null);
  const [selectedToolDetails, setSelectedToolDetails] = useState<Tool | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelModuleId, setCancelModuleId] = useState<string | null>(null);

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
    setCancelModuleId(toolId);
    setIsCancelDialogOpen(true);
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

  const confirmCancelation = () => {
    if (!cancelModuleId || !cancelReason.trim()) {
      toast.error("Por favor, informe o motivo do cancelamento");
      return;
    }
    
    const tool = tools.find(t => t.id === cancelModuleId);
    if (!tool) return;

    toast.success(`Módulo "${tool.title}" cancelado com sucesso!`);
    setIsCancelDialogOpen(false);
    setCancelModuleId(null);
    setCancelReason("");
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

  // Função para obter a classe do badge com base no status
  const getBadgeClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-800";
      case "contracted": 
        return "bg-yellow-100 text-yellow-800";
      case "configured": 
        return "bg-green-100 text-green-800";
      case "coming_soon":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContratadosCount = () => {
    return tools.filter(tool => 
      tool.status === "contracted" || tool.status === "configured"
    ).length;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Módulos do Sistema</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie as ferramentas de IA disponíveis para sua empresa
          </p>
        </div>

        <div className="relative px-16">
          <Carousel
            opts={{
              align: "start",
              loop: false // Parar no primeiro e último registro
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
                      className={`border ${isSelected ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'border-gray-200'} hover:shadow-md transition-shadow h-full cursor-pointer`}
                      onClick={() => showToolDetails(tool)}
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
                                <Button variant="ghost" size="icon" className="h-7 w-7 ml-1 rounded-full p-0">
                                  <MoreVertical size={15} className="text-gray-500" />
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
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-lg text-[#6E59A5]">
                            {formatPrice(tool.price)}<span className="text-xs text-gray-500">/mês</span>
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Link 
                            href="#" 
                            className={`w-full flex justify-between items-center text-xs text-[#9b87f5] hover:text-[#8a76e5]`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation(); // Evita que o clique propague para o card
                              showToolDetails(tool);
                            }}
                          >
                            Ver Detalhes
                            {isSelected ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </Link>

                          {tool.status === "not_contracted" && (
                            <Button 
                              className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 text-xs"
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
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {selectedToolDetails && (
          <div className="mt-6 bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 text-[#9b87f5]">
                  <selectedToolDetails.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold">{selectedToolDetails.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClass(selectedToolDetails.status)}`}>
                  {selectedToolDetails.badgeLabel}
                </span>

                {selectedToolDetails.status === "contracted" && (
                  <span className="text-yellow-600 text-xs font-medium flex items-center">
                    <AlertTriangle size={14} className="mr-1" /> Necessita configuração
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6 text-sm text-left">{selectedToolDetails.detailedDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <h4 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                    <CheckCircle2 size={18} className="mr-2" />
                    Benefícios
                  </h4>
                  <ul className="space-y-2">
                    {selectedToolDetails.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-sm text-left">
                        <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <h4 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                    <CheckCircle2 size={18} className="mr-2" />
                    Como Funciona
                  </h4>
                  <ul className="space-y-2">
                    {selectedToolDetails.howItWorks.map((step, idx) => (
                      <li key={idx} className="flex items-start text-sm text-left">
                        <Video size={16} className="text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diálogo de confirmação para contratar/cancelar módulo */}
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
                className={action === "contract" ? "bg-red-600 hover:bg-red-700" : ""}
                variant={action === "cancel" ? "destructive" : "default"}
              >
                {action === "contract" ? "Confirmar Contratação" : "Confirmar Cancelamento"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de cancelamento com coleta de motivo */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Cancelamento de Módulo
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Módulo selecionado para cancelamento:</p>
                {cancelModuleId && (
                  <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                    <div className="p-1.5 bg-[#F1F0FB] rounded-md text-[#9b87f5]">
                      {tools.find(t => t.id === cancelModuleId)?.icon && 
                        React.createElement(tools.find(t => t.id === cancelModuleId)?.icon as React.ElementType, { size: 16 })}
                    </div>
                    <span className="font-medium">{tools.find(t => t.id === cancelModuleId)?.title}</span>
                    <span className="text-xs text-gray-500">
                      ({formatPrice(tools.find(t => t.id === cancelModuleId)?.price || 0)}/mês)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="cancelReason" className="block text-sm font-medium mb-2 flex items-center">
                  <HelpCircle size={16} className="mr-1 text-[#9b87f5]" />
                  Por que você está cancelando este módulo?
                </label>
                <Textarea
                  id="cancelReason"
                  placeholder="Informe o motivo do cancelamento..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full"
                  rows={4}
                />
                {cancelReason.trim() === "" && (
                  <p className="text-xs text-red-500 mt-1">
                    O motivo do cancelamento é obrigatório
                  </p>
                )}
              </div>
              
              <p className="text-sm text-gray-500 flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  Ao cancelar, você perderá acesso a todas as funcionalidades deste módulo ao final do período de faturamento atual. 
                  Esta ação não pode ser desfeita.
                </span>
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Voltar
              </Button>
              <Button 
                onClick={confirmCancelation}
                variant="destructive"
                disabled={cancelReason.trim() === ""}
              >
                Confirmar Cancelamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default OrganizationModules;
