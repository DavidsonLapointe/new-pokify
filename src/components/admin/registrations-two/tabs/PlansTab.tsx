
import { CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, CreditCard, Users, Database, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/plans/planFetchService";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export const PlansTab = () => {
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);
  const { toast: uiToast } = useToast();

  const { data: fetchedPlans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans
  });

  // Initialize local plans when data is loaded
  useEffect(() => {
    if (fetchedPlans) {
      setLocalPlans(fetchedPlans);
      console.log("Planos iniciais carregados:", fetchedPlans);
    }
  }, [fetchedPlans]);

  // Plans handlers
  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(undefined);
    setEditPlanDialogOpen(true);
    console.log("Abrindo modal para criar novo plano");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setEditPlanDialogOpen(open);
    if (!open) {
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
        uiToast({
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
        uiToast({
          title: "Plano criado com sucesso",
          description: `O plano ${newPlan.name} foi criado.`
        });
      }
      
      // Fechar o modal depois de salvar
      setEditPlanDialogOpen(false);
      
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      uiToast({
        title: "Erro ao salvar plano",
        description: "Ocorreu um erro ao salvar o plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Function to get the right icon based on benefit text
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

  return (
    <div className="text-left">
      <CardTitle>Planos</CardTitle>
      <div className="pt-2">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Gerencie os planos disponíveis na plataforma
              </p>
            </div>
            
            <Button onClick={handleCreatePlan} className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          </div>

          {isLoading && localPlans.length === 0 ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error && localPlans.length === 0 ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <p className="text-red-500">Erro ao carregar planos. Por favor, tente novamente.</p>
            </div>
          ) : localPlans.length === 0 ? (
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
                <div key={plan.id} className="border rounded-lg shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 pt-6 flex-grow flex flex-col">
                    {/* Coloca o nome do plano e o preço em elementos separados, um abaixo do outro */}
                    <div className="flex flex-col mb-2">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <div className="text-purple-500 font-medium mt-1">
                        R$ {plan.price.toFixed(2)}<span className="text-sm text-gray-500">/mês</span>
                      </div>
                    </div>
                    
                    {/* Descrição com altura fixa para garantir alinhamento entre os cards */}
                    <div className="h-12 mb-6">
                      <p className="text-sm text-gray-500">
                        {plan.shortDescription}
                      </p>
                    </div>
                    
                    {/* Container para créditos com altura fixa e centralizado */}
                    <div className="h-16 flex items-center justify-center mb-6">
                      {plan.credits && (
                        <div className="bg-gray-100 rounded-md p-3 w-full flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm">{plan.credits} créditos mensais</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Container para recursos inclusos com altura fixa para garantir alinhamento */}
                    <div className="mb-4">
                      <div className="h-10 flex items-center">
                        <h4 className="font-medium text-sm text-gray-600">Recursos inclusos:</h4>
                      </div>
                      <Separator className="mb-4" />
                      <ul className="space-y-2">
                        {plan.benefits && Array.isArray(plan.benefits) && plan.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600 text-left">
                            <div className="h-5 w-5 bg-purple-100 flex items-center justify-center flex-shrink-0 mr-2 rounded-full">
                              <Check className="h-3 w-3 text-purple-500" />
                            </div>
                            <span className="text-left">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Spacer flexível para empurrar o botão para o final do card */}
                    <div className="flex-grow min-h-[20px]"></div>
                    
                    {/* Container do botão com altura fixa para garantir alinhamento entre os cards */}
                    <div className="h-12 flex items-center mt-4">
                      <Button 
                        onClick={() => handleEditPlan(plan)} 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar Plano
                      </Button>
                    </div>
                  </div>
                </div>
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
      </div>
    </div>
  );
};
