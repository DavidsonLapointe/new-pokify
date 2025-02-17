
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, DollarSign, Users, FileText } from "lucide-react";
import { useState } from "react";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";

const mockPlans = [
  {
    id: 1,
    name: "Basic",
    price: 99.90,
    maxUsers: 3,
    description: "Ideal para pequenas empresas iniciando no mercado",
    features: [
      "Até 3 usuários",
      "100 análises por mês",
      "Integração com 1 CRM",
      "Suporte por email",
    ],
    active: true,
  },
  {
    id: 2,
    name: "Professional",
    price: 199.90,
    maxUsers: 10,
    description: "Perfect para empresas em crescimento",
    features: [
      "Até 10 usuários",
      "500 análises por mês",
      "Integração com 3 CRMs",
      "Suporte prioritário",
      "API de integração",
    ],
    active: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 499.90,
    maxUsers: 25,
    description: "Para grandes empresas que precisam de mais recursos",
    features: [
      "Usuários ilimitados",
      "Análises ilimitadas",
      "Integrações ilimitadas",
      "Suporte 24/7",
      "API dedicada",
      "Manager dedicado",
    ],
    active: true,
  }
];

const Plans = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleSavePlan = (data: any) => {
    if (editingPlan) {
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id 
          ? { ...plan, ...data, id: plan.id }
          : plan
      ));
      setEditingPlan(null);
    } else {
      setPlans([...plans, { ...data, id: plans.length + 1 }]);
    }
  };

  const PlanCard = ({ plan }: { plan: any }) => (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
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
          {/* Linha de usuários máximos */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-y py-2">
            <Users className="w-4 h-4 shrink-0" />
            <span>Máximo de {plan.maxUsers === 25 ? "ilimitados" : plan.maxUsers} usuários</span>
          </div>

          {/* Seção de recursos */}
          <div className="space-y-4">
            <div className="text-sm font-medium border-b pb-2">Recursos inclusos:</div>
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
    <AdminLayout>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

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
    </AdminLayout>
  );
};

export default Plans;
