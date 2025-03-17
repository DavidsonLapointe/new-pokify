
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Pencil, Plus, CreditCard, Mail, Users, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/plans/planFetchService";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Badge } from "@/components/ui/badge";

const AdminPlans = () => {
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);

  const { data: fetchedPlans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
    onSuccess: (data) => {
      // Se não temos planos locais ainda, use os do fetchPlans
      if (localPlans.length === 0) {
        setLocalPlans(data);
      }
    }
  });

  // Use os planos locais para renderização, em vez dos fetchedPlans
  const plans = localPlans.length > 0 ? localPlans : fetchedPlans || [];

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(undefined);
    setEditPlanDialogOpen(true);
  };

  const handleSavePlan = async (updatedPlan: Partial<Plan>) => {
    // Se estamos editando um plano existente
    if (updatedPlan.id) {
      setLocalPlans(prevPlans => 
        prevPlans.map(p => p.id === updatedPlan.id ? { ...p, ...updatedPlan } as Plan : p)
      );
    } 
    // Se estamos criando um novo plano
    else if ('id' in updatedPlan) {
      setLocalPlans(prevPlans => [...prevPlans, updatedPlan as Plan]);
    }
    
    setEditPlanDialogOpen(false);
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
                  {plan.benefits.map((benefit, index) => (
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
                  Editar Plano
                </Button>
              </div>
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
