
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Coins } from "lucide-react";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { fetchPlans } from "@/services/planService";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando planos...");
      const fetchedPlans = await fetchPlans();
      console.log("Planos carregados:", fetchedPlans);
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      toast.error("Não foi possível carregar os planos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (data: Partial<Plan>) => {
    console.log("Salvando plano:", data);
    try {
      if (editingPlan) {
        // Atualizar plano existente
        console.log("Atualizando plano existente:", editingPlan.id);
        const updatedPlans = plans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...data, id: plan.id }
            : plan
        );
        setPlans(updatedPlans);
        setEditingPlan(null);
      } else {
        // Adicionar novo plano à lista
        console.log("Adicionando novo plano");
        const newPlan = { ...data, id: data.id || `temp-${Date.now()}` } as Plan;
        setPlans([...plans, newPlan]);
      }

      // Recarregar planos do banco de dados para garantir sincronização
      await loadPlans();
      toast.success(editingPlan ? "Plano atualizado com sucesso!" : "Plano criado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      toast.error("Ocorreu um erro ao salvar o plano.");
    }
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <Card className={`hover:shadow-md transition-shadow flex flex-col ${!plan.active ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
            <div className="flex items-baseline text-xl font-semibold text-primary">
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
            <ul className="space-y-2">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 mt-auto border-t">
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => setEditingPlan(plan)}
          >
            Editar Plano
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Planos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os planos disponíveis na plataforma
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                    <div className="flex items-baseline text-xl font-semibold text-primary">
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
                    <ul className="space-y-2">
                      {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t">
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => setEditingPlan(plan)}
                  >
                    Editar Plano
                  </Button>
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

export default Plans;
