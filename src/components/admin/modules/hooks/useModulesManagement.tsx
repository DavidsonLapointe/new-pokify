import { useState, useEffect } from "react";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { mockModules } from "@/components/admin/modules/module-constants";

export const useModulesManagement = () => {
  const [modules, setModules] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Plan | null>(null);
  const [deletingModuleId, setDeletingModuleId] = useState<string | number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Plan | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelModuleId, setCancelModuleId] = useState<string | number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSetupContactDialogOpen, setIsSetupContactDialogOpen] = useState(false);
  const [setupContactInfo, setSetupContactInfo] = useState({ name: "", phone: "" });

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
  const moduleGroups = () => {
    const groups = [];
    const groupSize = 4; // 4 cards por slide (mesma quantidade da grid original)
    
    for (let i = 0; i < modules.length; i += groupSize) {
      groups.push(modules.slice(i, i + groupSize));
    }
    
    return groups;
  };

  return {
    modules,
    isLoading,
    selectedModule,
    deletingModuleId,
    isCreateDialogOpen,
    editingModule,
    isCancelDialogOpen,
    cancelModuleId,
    cancelReason,
    isSetupContactDialogOpen,
    setupContactInfo,
    moduleGroups,
    setSelectedModule,
    setIsCreateDialogOpen,
    setEditingModule,
    setCancelModuleId,
    setCancelReason,
    setIsCancelDialogOpen,
    setIsSetupContactDialogOpen,
    setSetupContactInfo,
    handleSaveModule,
    handleDeleteModule,
    handleEditModule,
    handleSelectModule
  };
};
