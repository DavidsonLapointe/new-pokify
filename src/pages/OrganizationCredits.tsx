import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { CreditsBalanceCard } from "@/components/organization/plans/CreditsBalanceCard";
import { AnalysisPackagesDialog } from "@/components/organization/plans/AnalysisPackagesDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchPlanById } from "@/services/mockPlanService";
import { fetchCreditBalance } from "@/services/mockCreditsService";
import { mockPlans } from "@/mocks/plansMocks";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Loader2 } from "lucide-react";

export default function OrganizationCredits() {
  const { user } = useUser();
  const [isPackagesDialogOpen, setIsPackagesDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState({
    monthlyQuota: 0,
    used: 0,
    additional: 0
  });

  // Get the user's current plan ID, ensuring it's a string
  const planId = typeof user?.organization?.plan === 'string' 
    ? user?.organization?.plan 
    : user?.organization?.plan?.id || '';
  
  // Carregar dados do plano e créditos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Carregar o plano
        let plan: Plan | null = null;
        
        if (planId) {
          plan = await fetchPlanById(planId);
        }
        
        if (!plan) {
          // Fallback para o primeiro plano mockado
          const defaultPlan = mockPlans[0];
          plan = {
            id: defaultPlan.id,
            name: defaultPlan.name,
            price: defaultPlan.price,
            shortDescription: defaultPlan.shortDescription || defaultPlan.description,
            description: defaultPlan.description,
            benefits: defaultPlan.benefits || defaultPlan.features,
            active: defaultPlan.active,
            stripeProductId: defaultPlan.stripeProductId,
            stripePriceId: defaultPlan.stripePriceId,
            credits: defaultPlan.credits
          };
        }
        
        setCurrentPlan(plan);
        
        // Carregar os créditos
        const creditBalance = await fetchCreditBalance();
        
        if (creditBalance) {
          setCredits({
            monthlyQuota: plan.credits ? Number(plan.credits) : 100,
            used: creditBalance.usedCredits,
            additional: creditBalance.additionalCredits
          });
        } else {
          // Valores padrão se não conseguir carregar
          setCredits({
            monthlyQuota: plan.credits ? Number(plan.credits) : 100,
            used: 45,
            additional: 20
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        
        // Fallback para valores padrão em caso de erro
        const defaultPlan = mockPlans[0];
        setCurrentPlan({
          id: defaultPlan.id,
          name: defaultPlan.name,
          price: defaultPlan.price,
          shortDescription: defaultPlan.shortDescription || defaultPlan.description,
          description: defaultPlan.description,
          benefits: defaultPlan.benefits || defaultPlan.features,
          active: defaultPlan.active,
          stripeProductId: defaultPlan.stripeProductId,
          stripePriceId: defaultPlan.stripePriceId,
          credits: defaultPlan.credits
        });
        
        setCredits({
          monthlyQuota: 100,
          used: 45,
          additional: 20
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [planId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Não foi possível carregar as informações do plano.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Meus Créditos | Leadly</title>
      </Helmet>
      
      <div className="flex flex-col items-center justify-center w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Meus Créditos</h1>
          <p className="text-muted-foreground">Gerencie os créditos da sua organização</p>
        </div>

        <div className="max-w-md w-full">
          <CreditsBalanceCard 
            monthlyQuota={credits.monthlyQuota}
            used={credits.used}
            additionalCredits={credits.additional}
            onBuyMoreCredits={() => setIsPackagesDialogOpen(true)}
          />
        </div>

        <AnalysisPackagesDialog
          open={isPackagesDialogOpen}
          onOpenChange={setIsPackagesDialogOpen}
          onPackagePurchased={() => {
            // Refresh credits data after purchase
            // Em uma implementação real, recarregaríamos os dados
          }}
        />
      </div>
    </>
  );
}
