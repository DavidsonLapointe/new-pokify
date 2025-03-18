
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchPlanById } from "@/services/plans";
import { ChangePlanDialog } from "./ChangePlanDialog";
import { CurrentPlanCard } from "./CurrentPlanCard";
import { CreditsBalanceCard } from "./CreditsBalanceCard";
import { AnalysisPackagesDialog } from "./AnalysisPackagesDialog";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Plan } from "@/components/admin/plans/plan-form-schema";

export function PlanTabContent() {
  const { user } = useUser();
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);
  const [isPackagesDialogOpen, setIsPackagesDialogOpen] = useState(false);

  // Get the user's current plan ID, ensuring it's a string
  const planId = typeof user?.organization?.plan === 'string' 
    ? user?.organization?.plan 
    : user?.organization?.plan?.id || '';
  
  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', planId],
    queryFn: () => fetchPlanById(planId),
    enabled: !!planId,
  });

  // Next billing date (example: first day of next month)
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  nextBillingDate.setDate(1);

  // Properly handle missing data case
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Não foi possível carregar as informações do plano.</p>
      </div>
    );
  }

  // Create a properly typed plan object with numerical values where needed
  const typedPlan: Plan = {
    id: typeof plan.id === 'string' ? parseInt(plan.id, 10) : plan.id,
    name: plan.name,
    price: typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price,
    shortDescription: plan.shortDescription || plan.description || "",
    description: plan.description,
    benefits: Array.isArray(plan.benefits) ? plan.benefits : [],
    active: Boolean(plan.active),
    stripeProductId: plan.stripeProductId,
    stripePriceId: plan.stripePriceId,
    credits: typeof plan.credits === 'string' ? parseInt(plan.credits, 10) : Number(plan.credits || 0)
  };

  // Ensure credits and used values are numbers
  const monthlyQuota = typedPlan.credits || 0;
  const usedCredits = 45; // Example
  const additionalCredits = 20; // Example

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CurrentPlanCard 
        plan={typedPlan} 
        onChangePlan={() => setIsChangePlanDialogOpen(true)} 
        nextBillingDate={nextBillingDate}
      />
      
      <CreditsBalanceCard 
        monthlyQuota={monthlyQuota}
        used={usedCredits}
        additionalCredits={additionalCredits}
        onBuyMoreCredits={() => setIsPackagesDialogOpen(true)}
      />

      {/* Diálogos */}
      <ChangePlanDialog 
        open={isChangePlanDialogOpen}
        onOpenChange={setIsChangePlanDialogOpen}
        currentPlan={typedPlan}
        availablePlans={[
          // Exemplos de planos disponíveis (com valores numéricos)
          {
            id: 1,
            name: "Starter",
            price: 99,
            shortDescription: "Para pequenas empresas iniciando com IA",
            description: "Para pequenas empresas iniciando com IA",
            benefits: [
              "Análise de até 20 leads por mês",
              "Acesso ao módulo básico de IA",
              "Suporte via email"
            ],
            credits: 50,
            active: true
          },
          {
            id: 2,
            name: "Professional",
            price: 249,
            shortDescription: "Para equipes em crescimento",
            description: "Para equipes em crescimento",
            benefits: [
              "Análise de até 100 leads por mês",
              "Acesso a todos os módulos de IA",
              "Integração com CRM",
              "Suporte prioritário"
            ],
            credits: 150,
            active: true
          },
        ]}
      />

      <AnalysisPackagesDialog
        open={isPackagesDialogOpen}
        onOpenChange={setIsPackagesDialogOpen}
        onPackagePurchased={() => {
          // Refresh plan data or credits after purchase
          // Could refetch query here
        }}
      />
    </div>
  );
}
