
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
  HelpCircle,
  Zap,
  Mail,
  Settings,
  Pencil,
  Wrench
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { FinancialTitle } from "@/types/financial";
import { TermsDialog } from "@/components/admin/organizations/LegalDocumentsDialogs";

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
  price: number;
  credits?: number;
  badgeLabel: string;
  howItWorks: string[];
  benefits: string[];
}

interface CancelModuleFormValues {
  moduleId: string;
  reason: string;
}

interface SetupContactInfo {
  name: string;
  phone: string;
}

const OrganizationModules = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSetupContactDialogOpen, setIsSetupContactDialogOpen] = useState(false);
  const [isPaymentProcessingDialogOpen, setIsPaymentProcessingDialogOpen] = useState(false);
  const [isPaymentSuccessDialogOpen, setIsPaymentSuccessDialogOpen] = useState(false);
  const [isPaymentFailedDialogOpen, setIsPaymentFailedDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [action, setAction] = useState<"contract" | "cancel" | null>(null);
  const [selectedToolDetails, setSelectedToolDetails] = useState<Tool | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelModuleId, setCancelModuleId] = useState<string | null>(null);
  const [setupContactInfo, setSetupContactInfo] = useState<SetupContactInfo>({
    name: "",
    phone: ""
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  const tools: Tool[] = [
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
      // Inicia processamento do pagamento
      setIsConfirmDialogOpen(false);
      processPayment(tool);
    } else {
      toast.success(`Módulo "${tool.title}" cancelado com sucesso!`);
      setIsConfirmDialogOpen(false);
      setSelectedTool(null);
      setAction(null);
    }
  };

  const processPayment = async (tool: Tool) => {
    setProcessingPayment(true);
    setIsPaymentProcessingDialogOpen(true);
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resultado do pagamento (sucesso ou falha)
      const paymentSuccessful = Math.random() > 0.2; // 80% de chance de sucesso
      
      setIsPaymentProcessingDialogOpen(false);
      
      if (paymentSuccessful) {
        // Se o pagamento foi bem-sucedido, abre o diálogo para coletar informações de contato
        setIsPaymentSuccessDialogOpen(true);
        
        // Criar título financeiro automaticamente
        await createFinancialTitle(tool);
      } else {
        // Se o pagamento falhou, mostra o diálogo de falha
        setIsPaymentFailedDialogOpen(true);
        
        // Enviar e-mail para o suporte (simulado)
        sendSupportEmail(tool);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      setIsPaymentProcessingDialogOpen(false);
      setIsPaymentFailedDialogOpen(true);
    } finally {
      setProcessingPayment(false);
    }
  };

  const createFinancialTitle = async (tool: Tool) => {
    try {
      // Simulação de criação de título financeiro
      console.log(`Criando título financeiro para o módulo ${tool.title} no valor de ${tool.price}`);
      
      // Em um ambiente real, isso seria feito em uma chamada à API ou ao Supabase
      // const { data, error } = await supabase.from('financial_titles').insert({
      //   organization_id: 'id_da_organização',
      //   type: 'setup',
      //   value: tool.price,
      //   due_date: new Date().toISOString(),
      //   status: 'paid',
      //   payment_date: new Date().toISOString(),
      //   moduleId: tool.id,
      //   moduleName: tool.title
      // });
      
      // if (error) throw error;
    } catch (error) {
      console.error("Erro ao criar título financeiro:", error);
    }
  };

  const sendSupportEmail = async (tool: Tool) => {
    try {
      // Simulação de envio de e-mail para o suporte
      console.log(`Enviando e-mail para o suporte sobre falha na contratação do módulo ${tool.title}`);
      
      // Em um ambiente real, isso seria feito em uma chamada à API de e-mail
    } catch (error) {
      console.error("Erro ao enviar e-mail para o suporte:", error);
    }
  };

  const handleSubmitSetupContact = async () => {
    if (!setupContactInfo.name || !setupContactInfo.phone) {
      toast.error("Por favor, preencha todos os campos de contato.");
      return;
    }
    
    try {
      // Simulação de envio das informações de contato
      console.log("Informações de contato para setup:", setupContactInfo);
      
      // Em um ambiente real, isso seria feito em uma chamada à API ou ao Supabase
      // const { data, error } = await supabase.from('module_setup_contacts').insert({
      //   organization_id: 'id_da_organização',
      //   module_id: selectedTool,
      //   contact_name: setupContactInfo.name,
      //   contact_phone: setupContactInfo.phone,
      //   contracted_at: new Date().toISOString()
      // });
      
      // if (error) throw error;
      
      toast.success("Módulo contratado com sucesso! Nossa equipe entrará em contato em breve para iniciar o setup.");
      
      setIsPaymentSuccessDialogOpen(false);
      setSetupContactInfo({ name: "", phone: "" });
      
      // Atualizar o status do módulo para "contracted"
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool) {
          return { ...tool, status: "contracted" as ToolStatus, badgeLabel: "Contratada" };
        }
        return tool;
      });
      
      // Limpar estados
      setSelectedTool(null);
      setAction(null);
    } catch (error) {
      console.error("Erro ao enviar informações de contato:", error);
      toast.error("Erro ao enviar informações de contato. Tente novamente.");
    }
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
      case "setup":
        return {
          icon: <Wrench size={18} className="text-blue-500" />,
          tooltip: "Módulo em processo de setup"
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
      case "setup":
        return "bg-blue-100 text-blue-800";
    }
  };

  const getContratadosCount = () => {
    return tools.filter(tool => 
      tool.status === "contracted" || tool.status === "configured"
    ).length;
  };

  // Função para abrir os termos de uso
  const handleOpenTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTermsDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Módulos do Sistema</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie as ferramentas de IA disponíveis para sua empresa
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false
            }}
            className="w-full" 
          >
            <CarouselContent className="-ml-4">
              {tools.map((tool) => {
                const statusInfo = getStatusInfo(tool.status);
                const isSelected = selectedToolDetails?.id === tool.id;
                const Icon = tool.icon;
                
                return (
                  <CarouselItem key={tool.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                    <Card 
                      className={`w-[220px] h-[190px] flex-shrink-0 mx-auto ${isSelected ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => showToolDetails(tool)}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-between h-full relative">
                        <div className="absolute top-2 right-2 flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{statusInfo.icon}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{statusInfo.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {(tool.status === "contracted" || tool.status === "configured") && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 rounded-full p-0">
                                  <MoreVertical size={16} className="text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="z-50 bg-white">
                                <DropdownMenuItem 
                                  className="text-red-600 flex items-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                        
                        <div className="flex flex-col items-center mt-5">
                          <div className={`p-1 rounded-md ${isSelected ? 'text-[#9b87f5]' : 'text-gray-400'}`}>
                            {Icon && <Icon size={32} />}
                          </div>
                          
                          <div className="text-center w-full mt-2">
                            <p className="font-medium text-sm mb-1">{tool.title}</p>
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-[#6E59A5] font-bold">
                                {formatPrice(tool.price)}<span className="text-xs text-gray-500">/setup</span>
                              </p>
                              
                              {tool.credits && (
                                <p className="text-xs text-amber-700 flex items-center mt-1">
                                  <Zap size={10} className="mr-1 text-amber-500" />
                                  {tool.credits} créditos por execução
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto w-full pb-1">
                          {tool.status === "not_contracted" ? (
                            <Button 
                              className="w-full bg-red-600 hover:bg-red-700 h-9 text-xs px-1 shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContractTool(tool.id);
                              }}
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              Contratar
                            </Button>
                          ) : tool.status === "setup" ? (
                            <Button 
                              className="w-full bg-blue-500 hover:bg-blue-600 h-9 text-xs px-1 shadow-sm opacity-75 cursor-not-allowed"
                              disabled
                            >
                              <Wrench className="h-3 w-3 mr-1" />
                              Aguardando setup
                            </Button>
                          ) : (
                            <Link 
                              href="#" 
                              className="text-xs text-[#9b87f5] hover:text-[#8a76e5] hover:underline flex items-center justify-center w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                showToolDetails(tool);
                              }}
                            >
                              Ver Detalhes
                              {isSelected ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </Carousel>
        </div>

        {selectedToolDetails && (
          <Card className="p-5 bg-[#F8F8FB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 text-[#9b87f5]">
                {React.createElement(selectedToolDetails.icon, { size: 24 })}
              </div>
              <h3 className="text-xl font-semibold">{selectedToolDetails.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClass(selectedToolDetails.status)}`}>
                {selectedToolDetails.badgeLabel}
              </span>

              {selectedToolDetails.status === "contracted" && (
                <span className="text-yellow-600 text-xs font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" /> Necessita configuração
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-6 text-sm text-left">{selectedToolDetails.detailedDescription}</p>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-lighter text-primary px-3 py-1 rounded-md">
                <span className="text-sm font-semibold">{formatPrice(selectedToolDetails.price)}</span>
                <span className="text-xs"> (valor de setup)</span>
              </div>
              
              {selectedToolDetails.credits && (
                <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md flex items-center gap-1">
                  <Zap size={14} />
                  <span className="text-sm font-semibold">{selectedToolDetails.credits} créditos</span>
                  <span className="text-xs"> por execução</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-5 rounded-lg border border-gray-100 h-full">
                <h4 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Benefícios
                </h4>
                <ul className="space-y-2">
                  {selectedToolDetails.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-sm text-left">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-left">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-100 h-full">
                <h4 className="text-[#9b87f5] font-medium mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Como Funciona
                </h4>
                <ul className="space-y-2">
                  {selectedToolDetails.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start text-sm text-left">
                      {selectedToolDetails.icon && React.createElement(selectedToolDetails.icon, { 
                        className: "h-4 w-4 text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" 
                      })}
                      <span className="text-left">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {(selectedToolDetails.status === "contracted" || selectedToolDetails.status === "configured") && (
              <div className="mt-4">
                {selectedToolDetails.status === "configured" && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 h-9 mr-3"
                    onClick={() => console.log("Editar configuração do módulo", selectedToolDetails.id)}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Editar configuração
                  </Button>
                )}
                
                {selectedToolDetails.status === "contracted" && (
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-3 h-9"
                    onClick={() => console.log("Configurar módulo", selectedToolDetails.id)}
                  >
                    <Settings className="h-4 w-4 mr-2" /> Configurar módulo
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Diálogo de confirmação para contratar módulo */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Contratar Módulo
              </DialogTitle>
            </DialogHeader>
            
            {selectedTool && (
              <div className="py-4">
                <p className="mb-4">
                  Você está prestes a contratar o módulo "{tools.find(t => t.id === selectedTool)?.title}". 
                  O valor de {formatPrice((tools.find(t => t.id === selectedTool)?.price || 0))} será cobrado como setup (pagamento único).
                </p>
                
                {tools.find(t => t.id === selectedTool)?.credits && (
                  <div className="bg-amber-50 p-3 rounded-md mb-4 flex items-start text-sm">
                    <Zap className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-amber-800">
                      Este módulo consome <strong>{tools.find(t => t.id === selectedTool)?.credits}</strong> créditos por execução.
                    </p>
                  </div>
                )}
                
                <div className="bg-amber-50 p-3 rounded-md mb-6 flex items-start text-sm">
                  <CreditCard className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-amber-800">
                    A cobrança será realizada no cartão de crédito já cadastrado no sistema.
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Ao confirmar, você concorda com os{" "}
                  <Link 
                    href="#"
                    className="text-primary underline hover:text-primary/90"
                    onClick={handleOpenTerms}
                  >
                    termos de uso
                  </Link>{" "}
                  deste módulo.
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={confirmAction}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar Contratação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de processamento de pagamento */}
        <Dialog open={isPaymentProcessingDialogOpen} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Processando Pagamento
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-8 flex flex-col items-center">
              <div className="animate-pulse flex flex-col items-center justify-center">
                <CreditCard className="h-16 w-16 text-primary mb-4" />
                <p className="text-center text-lg">Processando seu pagamento...</p>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Não feche esta janela. O processo pode levar alguns segundos.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Diálogo de pagamento bem-sucedido e coleta de informações de contato */}
        <Dialog open={isPaymentSuccessDialogOpen} onOpenChange={setIsPaymentSuccessDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Pagamento Confirmado
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <p>
                O pagamento foi processado com sucesso! Nossa equipe de operações entrará em contato 
                para realizar o setup do módulo contratado.
              </p>
              
              <div className="bg-green-50 p-3 rounded-md mb-4 text-green-800 text-sm">
                <p className="font-medium mb-1">Próximos passos:</p>
                <p>
                  Por favor, informe os dados da pessoa responsável pelo setup do módulo em sua empresa:
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="contactName">Nome do responsável</Label>
                  <Input 
                    id="contactName" 
                    placeholder="Nome completo"
                    value={setupContactInfo.name}
                    onChange={(e) => setSetupContactInfo({...setupContactInfo, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="contactPhone">Telefone para contato</Label>
                  <Input 
                    id="contactPhone" 
                    placeholder="(XX) XXXXX-XXXX"
                    value={setupContactInfo.phone}
                    onChange={(e) => setSetupContactInfo({...setupContactInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleSubmitSetupContact}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirmar Informações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de falha no pagamento */}
        <Dialog open={isPaymentFailedDialogOpen} onOpenChange={setIsPaymentFailedDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Falha no Pagamento
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="mb-4">
                Ocorreu um erro ao processar seu pagamento. Por favor, verifique se os dados do seu cartão 
                estão corretos e tente novamente.
              </p>
              
              <div className="bg-red-50 p-3 rounded-md mb-4 text-red-800 text-sm flex items-start">
                <HelpCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <p>
                  Se o problema persistir, entre em contato com nosso suporte através do 
                  e-mail <span className="font-medium">suporte@leadly.com.br</span>.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPaymentFailedDialogOpen(false)}
              >
                Fechar
              </Button>
              <Button 
                className="bg-primary"
                onClick={() => {
                  setIsPaymentFailedDialogOpen(false);
                  setIsConfirmDialogOpen(true);
                }}
              >
                Tentar Novamente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para cancelar módulo */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-700">
                <Trash2 className="h-5 w-5" />
                Cancelar Módulo
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="mb-4">
                Você está prestes a cancelar o módulo{" "}
                <strong>
                  {tools.find(t => t.id === cancelModuleId)?.title}
                </strong>. 
                Esta ação não pode ser desfeita.
              </p>
              
              <div className="space-y-3">
                <Label htmlFor="cancelReason">
                  Por favor, informe o motivo do cancelamento:
                </Label>
                <Textarea 
                  id="cancelReason"
                  placeholder="Motivo do cancelamento..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Voltar
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmCancelation}
              >
                Confirmar Cancelamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para setup de contato */}
        <Dialog open={isSetupContactDialogOpen} onOpenChange={setIsSetupContactDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Configuração de Contato
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <p>
                Para finalizar a configuração do módulo, precisamos das informações
                de contato do responsável técnico.
              </p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="setupName">Nome do responsável técnico</Label>
                  <Input 
                    id="setupName" 
                    placeholder="Nome completo"
                    value={setupContactInfo.name}
                    onChange={(e) => setSetupContactInfo({...setupContactInfo, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="setupPhone">Telefone para contato</Label>
                  <Input 
                    id="setupPhone" 
                    placeholder="(XX) XXXXX-XXXX"
                    value={setupContactInfo.phone}
                    onChange={(e) => setSetupContactInfo({...setupContactInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsSetupContactDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-primary"
                onClick={() => {
                  // Lógica para processar as informações de contato
                  if (setupContactInfo.name && setupContactInfo.phone) {
                    toast.success("Informações de contato enviadas com sucesso!");
                    setIsSetupContactDialogOpen(false);
                  } else {
                    toast.error("Por favor, preencha todos os campos.");
                  }
                }}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de termos de uso */}
        <TermsDialog open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen} />
      </div>
    </TooltipProvider>
  );
};

export default OrganizationModules;
