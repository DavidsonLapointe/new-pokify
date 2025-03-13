
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Clock, 
  CreditCard,
  MoreVertical,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const tools: Tool[] = [
    {
      id: "video",
      title: "Prospecção com Vídeo",
      icon: Sparkles,
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
      icon: Sparkles,
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
      icon: Sparkles,
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
      icon: Sparkles,
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
      icon: Sparkles,
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

  const toggleDetails = (toolId: string) => {
    setShowDetails(showDetails === toolId ? null : toolId);
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
    }
  };

  // Formatação de preço em formato brasileiro
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Módulos do Sistema</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie os módulos de IA disponíveis para sua empresa
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.id} className="overflow-hidden border-t-4 border-[#9b87f5] hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F1F0FB] rounded-md text-[#9b87f5]">
                    <tool.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold">{tool.title}</h3>
                </div>

                {(tool.status === "contracted" || tool.status === "configured") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600 flex items-center gap-2"
                        onClick={() => handleCancelTool(tool.id)}
                      >
                        <Trash2 size={14} />
                        <span>Cancelar módulo</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <Badge variant="outline" className={`${getBadgeClass(tool.status)} mb-3`}>
                {getStatusIcon(tool.status)}
                <span className="ml-1">{tool.badgeLabel}</span>
              </Badge>
              
              <p className="text-gray-600 mb-4 text-sm line-clamp-2 h-10">
                {tool.description}
              </p>

              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-xl text-[#6E59A5]">
                  {formatPrice(tool.price)}<span className="text-xs text-gray-500">/mês</span>
                </span>
              </div>

              {showDetails === tool.id && (
                <div className="mt-4 mb-4 bg-gray-50 p-3 rounded-md text-sm">
                  <h4 className="font-medium mb-2">Benefícios principais:</h4>
                  <ul className="space-y-2">
                    {tool.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                {tool.status === "not_contracted" && (
                  <Button 
                    className="w-full bg-[#9b87f5] hover:bg-[#8a76e5] flex items-center justify-center gap-2"
                    onClick={() => handleContractTool(tool.id)}
                  >
                    <CreditCard size={16} />
                    Contratar Módulo
                  </Button>
                )}

                {tool.status === "coming_soon" && (
                  <Button 
                    className="w-full bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                    disabled
                  >
                    Em breve
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[#6E59A5] border-[#9b87f5] hover:bg-[#F1F0FB] mt-2"
                  onClick={() => toggleDetails(tool.id)}
                >
                  {showDetails === tool.id ? "Ocultar detalhes" : "Ver detalhes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
  );
};

export default OrganizationModules;
