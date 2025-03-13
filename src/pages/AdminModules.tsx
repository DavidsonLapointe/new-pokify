
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Coins, Trash2 } from "lucide-react";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { fetchPlans, deletePlan } from "@/services/plans";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";

const Modules = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando módulos...");
      const fetchedPlans = await fetchPlans();
      console.log("Módulos carregados:", fetchedPlans);
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      toast.error("Não foi possível carregar os módulos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (data: Partial<Plan>) => {
    console.log("Salvando módulo:", data);
    try {
      if (editingPlan) {
        console.log("Atualizando módulo existente:", editingPlan.id);
        const updatedPlans = plans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...data, id: plan.id }
            : plan
        );
        setPlans(updatedPlans);
        setEditingPlan(null);
      } else {
        console.log("Adicionando novo módulo");
        const newPlan = { ...data, id: data.id || `temp-${Date.now()}` } as Plan;
        setPlans([...plans, newPlan]);
      }

      await loadPlans();
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
      setDeletingPlanId(planId);
      const success = await deletePlan(planId);
      
      if (success) {
        // Reload plans to get the updated status
        await loadPlans();
      }
    } catch (error) {
      console.error("Erro ao desativar módulo:", error);
      toast.error("Ocorreu um erro ao desativar o módulo.");
    } finally {
      setDeletingPlanId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Módulos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os módulos de ferramentas de IA disponíveis na plataforma
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Módulo
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow flex flex-col h-[400px] animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded-md"></div>
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded-md"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`hover:shadow-md transition-shadow flex flex-col ${!plan.active ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-semibold pr-2 break-words max-w-[65%]">{plan.name}</CardTitle>
                    <div className="flex items-baseline text-xl font-semibold text-primary whitespace-nowrap">
                      <span className="text-base mr-1">R$</span>
                      {plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/mês</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                  <div className="space-y-4">
                    {plan.credits !== undefined && plan.credits > 0 && (
                      <div className="flex items-center gap-2 text-sm font-medium mb-4 bg-muted p-2 rounded-md">
                        <Coins className="h-4 w-4 text-primary" />
                        <span>{plan.credits} créditos mensais</span>
                      </div>
                    )}
                    
                    <div className="h-[32px] flex items-center border-b text-sm font-medium">
                      Recursos inclusos:
                    </div>
                    <ul className="space-y-0.5 min-h-[120px]">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        plan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span className="leading-tight" style={{ lineHeight: 1.2 }}>{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                          <span>Nenhum recurso listado</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t flex gap-2">
                  <Button 
                    className="flex-1" 
                    variant="default"
                    onClick={() => setEditingPlan(plan)}
                  >
                    Editar Módulo
                  </Button>
                  
                  {plan.active && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={deletingPlanId === plan.id.toString()}
                    >
                      {deletingPlanId === plan.id.toString() ? (
                        <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
