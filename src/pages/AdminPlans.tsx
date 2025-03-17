
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Pencil, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/plans/planFetchService";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Badge } from "@/components/ui/badge";

const AdminPlans = () => {
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);

  const { data: plans, isLoading, error, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans
  });

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(undefined);
    setEditPlanDialogOpen(true);
  };

  const handleSavePlan = async () => {
    await refetch();
    setEditPlanDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-red-500">Erro ao carregar planos. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planos</h1>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            Gerencie os planos disponíveis para suas organizações
          </p>
          <Button onClick={handleCreatePlan} className="bg-primary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id} className="border">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.active ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
                  ) : (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.shortDescription}
                </p>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="font-medium mb-2">Funções incluídas:</h4>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleEditPlan(plan)} 
                className="w-full bg-primary"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar Plano
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditPlanDialog
        open={editPlanDialogOpen}
        onOpenChange={setEditPlanDialogOpen}
        plan={selectedPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default AdminPlans;
