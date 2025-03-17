
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
  CheckCircle, AlertCircle, Pencil, ChevronDown, 
  ChevronUp
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    icon: "MessageCircle",
    credits: 5
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
    comingSoon: true,
    actionButtonText: "Criar Vídeos",
    icon: "Video",
    credits: 20
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
    icon: "Headphones",
    credits: 8
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
    icon: "UserRound",
    credits: 15
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
    icon: "LineChart",
    credits: 25
  }
];

// Definimos um schema para validação do formulário de módulo
const moduleFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  shortDescription: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  description: z.string().min(30, "Descrição completa deve ter pelo menos 30 caracteres"),
  benefits: z.string().min(1, "Adicione pelo menos um benefício"),
  howItWorks: z.string().min(1, "Adicione pelo menos uma etapa de como funciona"),
  active: z.boolean(),
  comingSoon: z.boolean().optional(),
  icon: z.string().optional(),
  actionButtonText: z.string().optional(),
  credits: z.number().nullable().optional(),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;

// Componente de Modal para edição de módulo
interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
  onSave: (data: Partial<Plan>) => void;
}

const ModuleDialog = ({
  open,
  onOpenChange,
  plan,
  onSave
}: ModuleDialogProps) => {
  const isEditing = !!plan;
  
  // Inicializar o formulário com react-hook-form
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      name: plan?.name || "",
      price: plan?.price ? plan.price.toString() : "",
      shortDescription: plan?.shortDescription || "",
      description: plan?.description || "",
      benefits: Array.isArray(plan?.benefits) ? plan.benefits.join("\n") : "",
      howItWorks: Array.isArray(plan?.howItWorks) ? plan.howItWorks.join("\n") : "",
      active: plan?.active !== undefined ? plan.active : true,
      comingSoon: plan?.comingSoon || false,
      icon: plan?.icon || "MessageCircle",
      actionButtonText: plan?.actionButtonText || "Contratar",
      credits: plan?.credits || null,
    }
  });

  // Efeito para atualizar o formulário quando o plano muda
  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        price: plan.price.toString(),
        shortDescription: plan.shortDescription || "",
        description: plan.description || "",
        benefits: Array.isArray(plan.benefits) ? plan.benefits.join("\n") : "",
        howItWorks: Array.isArray(plan.howItWorks) ? plan.howItWorks.join("\n") : "",
        active: plan.active,
        comingSoon: plan.comingSoon || false,
        icon: plan.icon || "MessageCircle",
        actionButtonText: plan.actionButtonText || "Contratar",
        credits: plan.credits || null,
      });
    } else {
      form.reset({
        name: "",
        price: "",
        shortDescription: "",
        description: "",
        benefits: "",
        howItWorks: "",
        active: true,
        comingSoon: false,
        icon: "MessageCircle",
        actionButtonText: "Contratar",
        credits: null,
      });
    }
  }, [plan, form]);

  // Função submit que processa o formulário
  const onSubmit = async (values: ModuleFormValues) => {
    try {
      // Converter valores do formulário para o formato esperado
      const formattedValues: Partial<Plan> = {
        ...values,
        price: parseFloat(values.price),
        benefits: values.benefits.split("\n").filter(b => b.trim()),
        howItWorks: values.howItWorks.split("\n").filter(hw => hw.trim()),
      };
      
      await onSave(formattedValues);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast.error("Ocorreu um erro ao salvar o módulo.");
    }
  };

  // Seleção de ícone simplificada (apenas um exemplo, você pode expandir)
  const iconOptions = [
    { value: "MessageCircle", label: "Chat" },
    { value: "Video", label: "Vídeo" },
    { value: "Headphones", label: "Áudio" },
    { value: "UserRound", label: "Usuário" },
    { value: "LineChart", label: "Gráfico" },
    { value: "Brain", label: "IA" },
    { value: "BookOpen", label: "Conhecimento" },
    { value: "CreditCard", label: "Pagamento" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto py-4">
        <DialogHeader className="py-1">
          <DialogTitle>{isEditing ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do módulo conforme necessário."
              : "Preencha as informações do novo módulo."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status do Módulo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value ? "Módulo ativo" : "Módulo inativo"}
                      </div>
                    </div>
                    <FormControl>
                      <CustomSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comingSoon"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Em breve</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value ? "Este módulo estará disponível em breve" : "Este módulo já está disponível"}
                      </div>
                    </div>
                    <FormControl>
                      <CustomSwitch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Módulo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor por mês (R$)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créditos por execução</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        value={field.value || ''} 
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actionButtonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do botão de ação</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-2" />

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição curta</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: Atendimento inteligente com IA para seus clientes"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição completa</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: O Chat AI Assistente é um módulo que utiliza inteligência artificial para automatizar e aprimorar o atendimento ao cliente."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefícios (um por linha)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        placeholder="Ex: Atendimento 24/7 para seus clientes&#10;Redução de até 65% no tempo de resposta&#10;Integração com CRM e sistemas de atendimento&#10;Análise de sentimento e personalização de respostas"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="howItWorks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como Funciona (um por linha)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        placeholder="Ex: Instale o widget em seu site ou plataforma&#10;Configure as respostas e conhecimento base&#10;A IA aprende continuamente com as interações&#10;Relatórios detalhados de desempenho"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary">
                {isEditing ? "Salvar Alterações" : "Criar Módulo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface ModuleCardProps {
  plan: Plan;
  onClick: () => void;
  isActive: boolean;
  onEditPlan: (plan: Plan) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  plan,
  onClick,
  isActive,
  onEditPlan
}) => {
  // Get the appropriate icon component
  const IconComponent = plan.icon && iconMap[plan.icon as keyof typeof iconMap] 
    ? iconMap[plan.icon as keyof typeof iconMap] 
    : MessageCircle; // Default to MessageCircle if not found

  return (
    <TooltipProvider>
      <Card 
        className={`h-[230px] cursor-pointer hover:shadow-md transition-all duration-300 ${isActive ? 'bg-[#F1F0FB]' : ''}`}
        onClick={onClick}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-primary-lighter rounded-md">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center gap-1">
              {plan.comingSoon && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Em breve disponível</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Badge 
                variant="secondary"
                className={`
                  ${plan.active 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"}
                `}
              >
                {plan.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
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
          <div 
            className="w-full text-xs text-primary flex items-center justify-center cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onClick(); // Use the onClick prop to select this plan, not open the edit dialog
            }}
          >
            Ver Detalhes {isActive ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

interface PageHeaderProps {
  setIsCreateDialogOpen: (open: boolean) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ setIsCreateDialogOpen }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Módulos</h1>
        <p className="text-muted-foreground">
          Gerencie as ferramentas de IA disponíveis no sistema
        </p>
      </div>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Módulo
      </Button>
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
    // Selecionar o primeiro plano ao carregar os planos
    if (plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
  }, [plans]);

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
        <>
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent className="px-2">
                {plans.map((plan) => (
                  <CarouselItem key={plan.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 pr-2">
                    <ModuleCard 
                      plan={plan} 
                      onClick={() => selectPlan(plan)}
                      isActive={selectedPlan?.id === plan.id}
                      onEditPlan={handleEditPlan}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>

          {selectedPlan && (
            <Card className="p-5 bg-[#F8F8FB]">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-lighter rounded-md">
                    {selectedPlan.icon && iconMap[selectedPlan.icon as keyof typeof iconMap] && 
                      React.createElement(iconMap[selectedPlan.icon as keyof typeof iconMap], { 
                        className: "h-6 w-6 text-primary" 
                      })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedPlan.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-start gap-1">
                    <Badge 
                      variant="secondary"
                      className={`${selectedPlan.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"}`}
                    >
                      {selectedPlan.active ? "Ativo" : "Inativo"}
                    </Badge>
                    
                    {selectedPlan.comingSoon && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Em breve
                      </Badge>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 bg-[#f0f0fc] text-primary px-2 py-0.5 rounded-full text-xs">
                          <Zap className="h-3 w-3" />
                          <span>{selectedPlan.credits || 0} créditos</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px]">
                        <p>Créditos consumidos a cada execução do módulo</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                    
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => handleEditPlan(selectedPlan)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-1 mt-2 mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 inline" />
                  <strong className="text-foreground font-medium">Valor:</strong> 
                  <span>R$ {selectedPlan.price.toFixed(2)}/mês</span>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-4">
                  {selectedPlan.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-3 flex items-center text-primary">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Benefícios
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.benefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-3 flex items-center text-primary">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Como funciona
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.howItWorks?.map((step, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <ModuleDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSave={handleSavePlan}
          />

          <ModuleDialog
            open={!!editingPlan}
            onOpenChange={(open) => {
              if (!open) setEditingPlan(null);
            }}
            plan={editingPlan || undefined}
            onSave={handleSavePlan}
          />
        </>
      )}
    </div>
  );
};

export default Modules;
