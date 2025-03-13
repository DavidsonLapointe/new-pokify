import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { 
  Plus, FileText, Trash2, MessageCircle, Video, 
  Headphones, UserRound, ShieldCheck, Brain, 
  BookOpen, CreditCard, LineChart, Mail, Share2, 
  Smartphone, Star, Zap, Briefcase, Bell, Clock, 
  Package, Blocks, AppWindow, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle
} from "lucide-react";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { fetchPlans, deletePlan } from "@/services/plans";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

// Map of icon names to their Lucide components
const iconMap = {
  MessageCircle,
  Video,
  Headphones,
  UserRound,
  ShieldCheck,
  Bell,
  Brain,
  BookOpen,
  CreditCard,
  FileText,
  LineChart,
  Mail,
  Share2,
  Smartphone,
  Star,
  Zap,
  Briefcase,
  Clock,
  Package,
  Blocks,
  AppWindow
};

// Mock data para os módulos baseado nos módulos do ambiente da organização
const mockModules: Plan[] = [
  {
    id: 1,
    name: "Chat AI Assistente",
    price: 97,
    shortDescription: "Atendimento inteligente com IA para seus clientes",
    description: "O Chat AI Assistente é um módulo que utiliza inteligência artificial para automatizar e aprimorar o atendimento ao cliente. Com ele, sua empresa pode oferecer respostas rápidas e precisas 24 horas por dia.",
    benefits: [
      "Atendimento 24/7 para seus clientes",
      "Redução de até 65% no tempo de resposta",
      "Integração com CRM e sistemas de atendimento",
      "Análise de sentimento e personalização de respostas"
    ],
    howItWorks: [
      "Instale o widget em seu site ou plataforma",
      "Configure as respostas e conhecimento base",
      "A IA aprende continuamente com as interações",
      "Relatórios detalhados de desempenho"
    ],
    active: true,
    comingSoon: false,
    actionButtonText: "Contratar Assistente",
    icon: "MessageCircle"
  },
  {
    id: 2,
    name: "Criador de Vídeos AI",
    price: 197,
    shortDescription: "Crie vídeos profissionais automaticamente com IA",
    description: "O Criador de Vídeos AI permite que você produza vídeos profissionais automaticamente a partir de textos, roteiros ou instruções. Economize tempo e recursos na criação de conteúdo visual.",
    benefits: [
      "Criação de vídeos em minutos, não dias",
      "Diversas opções de formato e estilo",
      "Biblioteca com milhares de templates",
      "Narração com vozes realistas em português"
    ],
    howItWorks: [
      "Adicione texto ou roteiro para o vídeo",
      "Selecione o estilo e formato desejado",
      "A IA gera automaticamente o vídeo",
      "Edite e ajuste conforme necessário"
    ],
    active: true,
    comingSoon: false,
    actionButtonText: "Criar Vídeos",
    icon: "Video"
  },
  {
    id: 3,
    name: "Transcrição de Áudio",
    price: 147,
    shortDescription: "Transforme áudios em textos com precisão incrível",
    description: "O módulo de Transcrição de Áudio converte automaticamente qualquer tipo de gravação de voz ou áudio em texto, com suporte a múltiplos idiomas e alta precisão para termos técnicos.",
    benefits: [
      "Precisão de transcrição superior a 95%",
      "Reconhecimento de múltiplos idiomas",
      "Identificação de diferentes falantes",
      "Integração com plataformas de reuniões"
    ],
    howItWorks: [
      "Faça upload do arquivo de áudio ou link",
      "Selecione o idioma principal",
      "A IA transcreve automaticamente",
      "Exporte em diversos formatos"
    ],
    active: true,
    comingSoon: false,
    actionButtonText: "Transcrever Áudios",
    icon: "Headphones"
  },
  {
    id: 4,
    name: "CRM Inteligente",
    price: 247,
    shortDescription: "Gerencie relacionamentos com clientes usando IA",
    description: "O CRM Inteligente é um sistema completo de gestão de relacionamento com clientes potencializado por inteligência artificial, que analisa comportamentos, prevê tendências e sugere ações.",
    benefits: [
      "Aumento de 40% na taxa de conversão",
      "Previsão de propensão de compra",
      "Automação de tarefas repetitivas",
      "Insights detalhados sobre clientes"
    ],
    howItWorks: [
      "Importe seus contatos e histórico",
      "Configure os parâmetros de negócio",
      "A IA analisa e categoriza seus leads",
      "Receba recomendações de ações"
    ],
    active: true,
    comingSoon: false,
    actionButtonText: "Adquirir CRM",
    icon: "UserRound"
  },
  {
    id: 5,
    name: "Análise de Tendências",
    price: 397,
    shortDescription: "Antecipe tendências de mercado com análise preditiva",
    description: "O módulo de Análise de Tendências utiliza algoritmos avançados de IA para identificar padrões e prever tendências futuras no seu mercado, dando vantagem competitiva à sua empresa.",
    benefits: [
      "Previsão de tendências com 3-6 meses de antecedência",
      "Análise competitiva automatizada",
      "Monitoramento de mercado em tempo real",
      "Recomendações estratégicas personalizadas"
    ],
    howItWorks: [
      "Conecte suas fontes de dados",
      "Defina os indicadores relevantes",
      "O sistema analisa continuamente o mercado",
      "Receba relatórios periódicos e alertas"
    ],
    active: false,
    comingSoon: true,
    actionButtonText: "Analisar Tendências",
    icon: "LineChart"
  }
];

interface ModuleCardProps {
  plan: Plan;
  onClick: () => void;
  isActive: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  plan,
  onClick,
  isActive
}) => {
  // Get the appropriate icon component
  const IconComponent = plan.icon && iconMap[plan.icon as keyof typeof iconMap] 
    ? iconMap[plan.icon as keyof typeof iconMap] 
    : MessageCircle; // Default to MessageCircle if not found

  return (
    <Card 
      className={`h-[230px] cursor-pointer hover:shadow-md transition-all duration-300 ${isActive ? 'bg-[#F1F0FB]' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-primary-lighter rounded-md">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <Badge 
            variant={plan.active ? "default" : "destructive"}
            className={plan.active ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {plan.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold mt-2 line-clamp-1">
          {plan.name}
        </CardTitle>
        <div className="text-primary font-semibold">
          R$ {plan.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mês</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {plan.shortDescription}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleEditPlan(plan);
          }}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

interface PageHeaderProps {
  setIsCreateDialogOpen: (open: boolean) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ setIsCreateDialogOpen }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold">Módulos</h1>
      <p className="text-muted-foreground">
        Gerencie as ferramentas de IA disponíveis no sistema
      </p>
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Módulo
        </Button>
      </div>
    </div>
  );
};

const LoadingState: React.FC = () => {
  return (
    <div>
      <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded-md w-full mb-8 animate-pulse"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-[230px] animate-pulse">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded-md w-3/4 mt-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full mt-1"></div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-8 bg-gray-200 rounded-md w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Modules = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    // Selecionar o primeiro plano ao carregar
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, selectedPlan]);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando módulos...");
      // Simulamos a busca no banco de dados usando dados mockados
      // Em um ambiente real, nós usaríamos fetchPlans()
      setTimeout(() => {
        console.log("Módulos carregados com mock data:", mockModules);
        setPlans(mockModules);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      toast.error("Não foi possível carregar os módulos. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (data: Partial<Plan>) => {
    console.log("Salvando módulo:", data);
    try {
      // Se estiver editando um módulo existente e mudando ele para inativo
      if (editingPlan && editingPlan.active && data.active === false) {
        // Verificar se existem organizações usando este módulo
        const { data: orgsUsingModule, error } = await supabase
          .from('subscriptions')
          .select('organization_id, organizations!inner(name)')
          .eq('status', 'active')
          .filter('organizations.plan', 'eq', editingPlan.name);
          
        if (error) {
          console.error("Erro ao verificar organizações:", error);
          throw new Error("Erro ao verificar se o módulo está em uso");
        }
        
        // Se existirem organizações usando o módulo, impedir a inativação
        if (orgsUsingModule && orgsUsingModule.length > 0) {
          const orgNames = orgsUsingModule.map((sub: any) => sub.organizations.name).join(", ");
          
          toast.error(
            `Não é possível inativar este módulo pois está sendo utilizado por ${orgsUsingModule.length} organização(ões): ${orgNames}`
          );
          
          // Manter o módulo ativo
          data.active = true;
          return;
        }
      }
      
      if (editingPlan) {
        console.log("Atualizando módulo existente:", editingPlan.id);
        const updatedPlans = plans.map(plan =>
          plan.id === editingPlan.id
            ? { ...plan, ...data, id: plan.id }
            : plan
        );
        setPlans(updatedPlans);
        setEditingPlan(null);
        
        // Se o plano selecionado for o mesmo que estamos editando, atualize-o
        if (selectedPlan && selectedPlan.id === editingPlan.id) {
          const updatedPlan = updatedPlans.find(p => p.id === editingPlan.id);
          if (updatedPlan) {
            setSelectedPlan(updatedPlan);
          }
        }
      } else {
        console.log("Adicionando novo módulo");
        const newPlan = { ...data, id: data.id || `temp-${Date.now()}` } as Plan;
        setPlans([...plans, newPlan]);
      }

      // Em um ambiente real, nós chamaríamos o loadPlans() novamente para atualizar
      toast.success(editingPlan ? "Módulo atualizado com sucesso!" : "Módulo criado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
      toast.error("Ocorreu um erro ao salvar o módulo.");
    }
  };

  const handleDeletePlan = async (id: string | number) => {
    if (!id) return;

    try {
      // Convert id to string if it's a number
      const planId = id.toString();
      
      // Encontrar o plano que está sendo desativado
      const planToDelete = plans.find(p => p.id.toString() === planId);
      if (!planToDelete) {
        toast.error("Módulo não encontrado");
        return;
      }
      
      // Verificar se existem organizações usando este módulo
      const { data: orgsUsingModule, error } = await supabase
        .from('subscriptions')
        .select('organization_id, organizations!inner(name)')
        .eq('status', 'active')
        .filter('organizations.plan', 'eq', planToDelete.name);
        
      if (error) {
        console.error("Erro ao verificar organizações:", error);
        throw new Error("Erro ao verificar se o módulo está em uso");
      }
      
      // Se existirem organizações usando o módulo, impedir a desativação
      if (orgsUsingModule && orgsUsingModule.length > 0) {
        const orgNames = orgsUsingModule.map((sub: any) => sub.organizations.name).join(", ");
        
        toast.error(
          `Não é possível desativar este módulo pois está sendo utilizado por ${orgsUsingModule.length} organização(ões): ${orgNames}`
        );
        return;
      }
      
      setDeletingPlanId(planId);
      // Em um ambiente real, chamaríamos deletePlan(planId)
      // Simulando a exclusão localmente
      setTimeout(() => {
        const updatedPlans = plans.map(plan => 
          plan.id.toString() === planId 
            ? { ...plan, active: false }
            : plan
        );
        setPlans(updatedPlans);
        setDeletingPlanId(null);
        
        // Se o plano selecionado for o mesmo que estamos desativando, atualize-o
        if (selectedPlan && selectedPlan.id.toString() === planId) {
          const updatedPlan = updatedPlans.find(p => p.id.toString() === planId);
          if (updatedPlan) {
            setSelectedPlan(updatedPlan);
          }
        }
        
        toast.success("Módulo desativado com sucesso!");
      }, 1000);
    } catch (error) {
      console.error("Erro ao desativar módulo:", error);
      toast.error("Ocorreu um erro ao desativar o módulo.");
      setDeletingPlanId(null);
    }
  };

  const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  return (
    <div className="space-y-8">
      <PageHeader setIsCreateDialogOpen={setIsCreateDialogOpen} />

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="px-2">
              {plans.map((plan) => (
                <CarouselItem key={plan.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 pr-2">
                  <ModuleCard 
                    plan={plan} 
                    onClick={() => selectPlan(plan)}
                    isActive={selectedPlan?.id === plan.id}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      )}

      <EditPlanDialog
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
        plan={editingPlan}
        onSave={handleSavePlan}
      />

      <EditPlanDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default Modules;
