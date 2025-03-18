
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
  DialogFooter,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleDialog } from "@/components/admin/modules/ModuleDialog";
import { ModuleCard } from "@/components/admin/modules/ModuleCard";
import { ModuleDetails } from "@/components/admin/modules/ModuleDetails";
import { LoadingState } from "@/components/admin/modules/LoadingState";
import { PageHeader } from "@/components/admin/modules/PageHeader";
import { mockModules, iconMap } from "@/components/admin/modules/module-constants";

const AdminModules = () => {
  const [modules, setModules] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Plan | null>(null);
  const [deletingModuleId, setDeletingModuleId] = useState<string | number | null>(null);
  const [selectedModule, setSelectedModule] = useState<Plan | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [setupContactInfo, setSetupContactInfo] = useState({ name: "", phone: "" });
  const [isSetupContactDialogOpen, setIsSetupContactDialogOpen] = useState(false);
  const [cancelModuleId, setCancelModuleId] = useState<string | number | null>(null);

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    // Selecionar o primeiro módulo ao carregar os módulos
    if (modules.length > 0 && !selectedModule) {
      setSelectedModule(modules[0]);
    }
  }, [modules, selectedModule]);

  const loadModules = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando módulos...");
      // Simulamos a busca no banco de dados usando dados mockados
      // Em um ambiente real, nós usaríamos fetchPlans() e adaptaríamos para módulos
      setTimeout(() => {
        console.log("Módulos carregados com mock data:", mockModules);
        setModules(mockModules);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      toast.error("Não foi possível carregar os módulos. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleSaveModule = async (data: Partial<Plan>) => {
    console.log("Salvando módulo:", data);
    try {
      // Se estiver editando um módulo existente
      if (editingModule) {
        // Atualiza o módulo existente
        const updatedModule = {
          ...editingModule,
          ...data
        };
        
        // Atualiza a lista de módulos
        setModules(prevModules => 
          prevModules.map(m => m.id === editingModule.id ? updatedModule : m)
        );
        
        // Atualiza o módulo selecionado se for o que está sendo editado
        if (selectedModule && selectedModule.id === editingModule.id) {
          setSelectedModule(updatedModule);
        }
        
        toast.success("Módulo atualizado com sucesso!");
      } else {
        // Criar um novo módulo
        const newModule = {
          id: Date.now(), // ID temporário
          ...data,
          active: data.active !== undefined ? data.active : true,
          comingSoon: data.comingSoon || false,
        } as Plan;
        
        // Adicionar à lista de módulos
        setModules(prevModules => [...prevModules, newModule]);
        
        // Selecionar o novo módulo
        setSelectedModule(newModule);
        
        toast.success("Módulo criado com sucesso!");
      }
      
      // Fechar o modal de edição
      setEditingModule(null);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
      toast.error("Ocorreu um erro ao salvar o módulo.");
    }
  };

  const handleDeleteModule = async (id: string | number) => {
    console.log("Deletando módulo:", id);
    try {
      setDeletingModuleId(id);
      
      // Em um ambiente real, chamaríamos deletePlan(id)
      // Simulação de deleção com timeout
      setTimeout(() => {
        // Remove o módulo da lista
        setModules(prevModules => prevModules.filter(m => m.id !== id));
        
        // Se o módulo selecionado for o que está sendo deletado, selecionar outro
        if (selectedModule && selectedModule.id === id) {
          const remainingModules = modules.filter(m => m.id !== id);
          setSelectedModule(remainingModules.length > 0 ? remainingModules[0] : null);
        }
        
        setDeletingModuleId(null);
        toast.success("Módulo removido com sucesso.");
      }, 1000);
    } catch (error) {
      console.error("Erro ao deletar módulo:", error);
      toast.error("Ocorreu um erro ao remover o módulo.");
      setDeletingModuleId(null);
    }
  };

  const handleEditModule = (module: Plan) => {
    setEditingModule(module);
    setIsCreateDialogOpen(true);
  };

  const handleSelectModule = (module: Plan) => {
    setSelectedModule(selectedModule && selectedModule.id === module.id ? null : module);
  };

  // Dividir os módulos em grupos de 4 para o carrossel no formato da grade
  // Esta abordagem preserva o layout original da grade enquanto adiciona funcionalidade do carrossel
  const moduleGroups = () => {
    const groups = [];
    const groupSize = 4; // 4 cards por slide (mesma quantidade da grid original)
    
    for (let i = 0; i < modules.length; i += groupSize) {
      groups.push(modules.slice(i, i + groupSize));
    }
    
    return groups;
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <PageHeader setIsCreateDialogOpen={setIsCreateDialogOpen} />
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <ScrollArea className="w-full">
          {/* Carrossel de módulos */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {moduleGroups().map((group, groupIndex) => (
                  <CarouselItem key={groupIndex}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
                      {group.map((module) => (
                        <ModuleCard
                          key={module.id}
                          module={module}
                          onClick={() => handleSelectModule(module)}
                          isActive={selectedModule?.id === module.id}
                          onEditModule={handleEditModule}
                        />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
          
          {selectedModule && (
            <Card className="mt-8 bg-[#F8F8FB] flex flex-col max-w-5xl mx-auto shadow-sm">
              <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-lighter rounded-md">
                      {selectedModule.icon && iconMap[selectedModule.icon as keyof typeof iconMap] 
                        ? React.createElement(iconMap[selectedModule.icon as keyof typeof iconMap], { className: "h-8 w-8 text-primary" })
                        : <MessageCircle className="h-8 w-8 text-primary" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{selectedModule.name}</CardTitle>
                        {selectedModule.comingSoon && (
                          <TooltipProvider>
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
                          </TooltipProvider>
                        )}
                        <Badge 
                          variant="secondary"
                          className={`
                            ${selectedModule.active 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-red-100 text-red-800 hover:bg-red-100"}
                          `}
                        >
                          {selectedModule.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg text-primary font-semibold">
                          R$ {selectedModule.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal"> (valor único de setup)</span>
                        </div>
                        {selectedModule.credits && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                  <Zap className="h-3 w-3" />
                                  <span className="font-medium">{selectedModule.credits} créditos</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Créditos consumidos por execução</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs px-3"
                      onClick={() => handleEditModule(selectedModule)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs px-3 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteModule(selectedModule.id)}
                      disabled={deletingModuleId === selectedModule.id}
                    >
                      {deletingModuleId === selectedModule.id ? (
                        <>
                          <span className="animate-spin mr-1">
                            ●
                          </span>
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pt-0 pb-6 flex-1 flex flex-col">
                {/* Sobre o módulo */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-purple-500">Sobre o módulo</h3>
                  <p className="text-muted-foreground text-left">{selectedModule.description}</p>
                  
                  {/* Informação de créditos */}
                  {selectedModule.credits && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-600" />
                        <p className="text-amber-800">
                          <span className="font-semibold">Consumo de créditos:</span> Este módulo consome <span className="font-semibold">{selectedModule.credits} créditos</span> por cada execução
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                  
                {/* Benefícios e Como funciona */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-purple-500">Benefícios</h3>
                    <div className="space-y-2">
                      {selectedModule.benefits?.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-left">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                    
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-purple-500">Como funciona</h3>
                    <div className="space-y-2">
                      {selectedModule.howItWorks?.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="bg-purple-100 text-purple-600 font-semibold rounded-full h-6 w-6 flex items-center justify-center text-sm mt-0.5 flex-shrink-0">
                            {i+1}
                          </div>
                          <p className="text-left">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      )}
      
      <ModuleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        module={editingModule}
        onSave={handleSaveModule}
      />

      {/* Dialog para cancelar módulo */}
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
                {modules.find(m => m.id === cancelModuleId)?.name}
              </strong>. 
              Esta ação não pode ser desfeita.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive">
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para setup de contato */}
      <Dialog open={isSetupContactDialogOpen} onOpenChange={setIsSetupContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setup de Contato</DialogTitle>
            <DialogDescription>
              Informe os dados para que nossa equipe entre em contato e configure o módulo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </label>
              <input
                id="name"
                value={setupContactInfo.name}
                onChange={(e) => setSetupContactInfo(prev => ({ ...prev, name: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone para contato
              </label>
              <input
                id="phone"
                value={setupContactInfo.phone}
                onChange={(e) => setSetupContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetupContactDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModules;
