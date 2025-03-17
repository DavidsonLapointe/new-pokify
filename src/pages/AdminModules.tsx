
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
        
        // Adicionar à lista de módulos - AQUI ESTÁ A CORREÇÃO
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

  return (
    <div className="container py-6 space-y-8">
      <PageHeader setIsCreateDialogOpen={setIsCreateDialogOpen} />
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => handleSelectModule(module)}
                isActive={selectedModule?.id === module.id}
                onEditModule={handleEditModule}
              />
            ))}
          </div>
          
          {selectedModule && (
            <ModuleDetails
              module={selectedModule}
              onEdit={handleEditModule}
              onDelete={handleDeleteModule}
              isDeleting={deletingModuleId === selectedModule.id}
            />
          )}
        </>
      )}
      
      <ModuleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        module={editingModule}
        onSave={handleSaveModule}
      />
    </div>
  );
};

export default AdminModules;
