
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Pencil, Plus, CreditCard, Mail, Users, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/plans/planFetchService";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AdminPlans = () => {
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);
  const { toast } = useToast();

  const { data: fetchedPlans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans
  });

  // Inicializa os planos locais quando os dados forem carregados
  useEffect(() => {
    if (fetchedPlans) {
      setLocalPlans(fetchedPlans);
      console.log("Planos iniciais carregados:", fetchedPlans);
    }
  }, [fetchedPlans]);

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    // Garantir que o plano selecionado é definido como undefined para limpar o formulário
    setSelectedPlan(undefined);
    setEditPlanDialogOpen(true);
    console.log("Abrindo modal para criar novo plano");
  };

  // Função que será chamada quando o modal for fechado ou cancelado
  const handleDialogOpenChange = (open: boolean) => {
    setEditPlanDialogOpen(open);
    if (!open) {
      // Resetando o plano selecionado quando o modal é fechado
      setSelectedPlan(undefined);
      console.log("Modal fechado, seleção de plano resetada");
    }
  };

  const handleSavePlan = async (updatedPlan: Partial<Plan>) => {
    try {
      // Se estamos editando um plano existente
      if (updatedPlan.id) {
        setLocalPlans(prevPlans => 
          prevPlans.map(p => p.id === updatedPlan.id ? { ...p, ...updatedPlan } as Plan : p)
        );
        console.log("Plano atualizado:", updatedPlan);
        toast({
          title: "Plano atualizado com sucesso",
          description: `O plano ${updatedPlan.name} foi atualizado.`
        });
      } 
      // Se estamos criando um novo plano
      else {
        // Criar um novo plano completo com ID
        const newPlan: Plan = { 
          ...updatedPlan as Plan,
          id: Date.now(), // Garantir um ID único baseado no timestamp
          benefits: Array.isArray(updatedPlan.benefits) 
            ? updatedPlan.benefits 
            : updatedPlan.benefits 
              ? (updatedPlan.benefits as string).split('\n').filter(b => b.trim()) 
              : []
        };
        
        console.log("Novo plano criado:", newPlan);
        
        // Atualizar o estado com o novo plano
        setLocalPlans(prevPlans => [...prevPlans, newPlan]);
        
        // Exibir toast de sucesso
        toast({
          title: "Plano criado com sucesso",
          description: `O plano ${newPlan.name} foi criado.`
        });
      }
      
      // Fechar o modal depois de salvar
      setEditPlanDialogOpen(false);
      
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      toast({
        title: "Erro ao salvar plano",
        description: "Ocorreu um erro ao salvar o plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para obter o ícone correto baseado no texto do benefício
  const getBenefitIcon = (benefit: string) => {
    if (benefit.toLowerCase().includes('usuário') || benefit.toLowerCase().includes('usuários')) {
      return <Users className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    } else if (benefit.toLowerCase().includes('crédito') || benefit.toLowerCase().includes('créditos')) {
      return <CreditCard className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    } else if (benefit.toLowerCase().includes('integração') || benefit.toLowerCase().includes('crm')) {
      return <Database className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    } else if (benefit.toLowerCase().includes('suporte') || benefit.toLowerCase().includes('email')) {
      return <Mail className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    }
    return <Check className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
  };

  // Debug: mostrar planos locais sempre que mudam
  useEffect(() => {
    console.log("Estado atual dos planos:", localPlans);
  }, [localPlans]);

  if (isLoading && localPlans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && localPlans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-red-500">Erro ao carregar planos. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Planos</h1>
          <p className="text-muted-foreground">
            Gerencie os planos disponíveis na plataforma
          </p>
        </div>
        
        <Button onClick={handleCreatePlan} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {localPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum plano cadastrado</h3>
          <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
            Crie seu primeiro plano para disponibilizar às organizações.
          </p>
          <Button onClick={handleCreatePlan} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Plano
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localPlans.map((plan) => (
            <Card key={plan.id} className="border rounded-lg shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="text-purple-500 font-medium">
                      R$ {plan.price.toFixed(2)}<span className="text-sm text-gray-500">/mês</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.shortDescription}
                  </p>
                  
                  {plan.credits && (
                    <div className="flex items-center mt-3 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                      {plan.credits} créditos mensais
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-3 bg-gray-50">
                  <h4 className="font-medium text-sm mb-2">Recursos inclusos:</h4>
                  <ul className="space-y-2">
                    {plan.benefits && Array.isArray(plan.benefits) && plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        {getBenefitIcon(benefit)}
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-white">
                  <Button 
                    onClick={() => handleEditPlan(plan)} 
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar Plano
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditPlanDialog
        open={editPlanDialogOpen}
        onOpenChange={handleDialogOpenChange}
        plan={selectedPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default AdminPlans;
