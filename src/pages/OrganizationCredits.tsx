import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { CreditsBalanceCard } from "@/components/organization/plans/CreditsBalanceCard";
import { AnalysisPackagesDialog } from "@/components/organization/plans/AnalysisPackagesDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchPlanById } from "@/services/plans";
import { mockPlans } from "@/mocks/plansMocks";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Loader2 } from "lucide-react";

export default function OrganizationCredits() {
  const { user } = useUser();
  const [isPackagesDialogOpen, setIsPackagesDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the user's current plan ID, ensuring it's a string
  const planId = typeof user?.organization?.plan === 'string' 
    ? user?.organization?.plan 
    : user?.organization?.plan?.id || '';
  
  // Use effect to handle plan fetching with fallback to mocks
  useEffect(() => {
    const loadPlan = async () => {
      setIsLoading(true);
      
      try {
        if (!planId) {
          throw new Error("No plan ID available");
        }
        
        // Try to fetch from the API
        const fetchedPlan = await fetchPlanById(planId);
        
        if (fetchedPlan) {
          setCurrentPlan(fetchedPlan);
        } else {
          // If no plan found, fallback to mock data
          const mockPlan = mockPlans.find(p => p.id.toString() === planId || p.name.toLowerCase() === planId.toLowerCase());
          
          if (mockPlan) {
            setCurrentPlan({
              id: mockPlan.id,
              name: mockPlan.name,
              price: mockPlan.price,
              shortDescription: mockPlan.shortDescription || mockPlan.description,
              description: mockPlan.description,
              benefits: mockPlan.benefits || mockPlan.features,
              active: mockPlan.active,
              stripeProductId: mockPlan.stripeProductId,
              stripePriceId: mockPlan.stripePriceId,
              credits: mockPlan.credits
            });
          } else {
            // If no matching plan found, use first mock plan
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
            console.log("Using default mock plan");
          }
        }
      } catch (error) {
        console.error("Error loading plan:", error);
        // Fallback to first mock plan on error
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
      } finally {
        setIsLoading(false);
      }
    };

    loadPlan();
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

  // Ensure monthly quota, used credits, and additional credits are numbers
  const monthlyQuota = typeof currentPlan.credits === 'string' 
    ? parseInt(currentPlan.credits, 10) 
    : Number(currentPlan.credits || 0);
    
  const usedCredits = 45; // Example values
  const additionalCredits = 20; // Example values

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
            monthlyQuota={monthlyQuota}
            used={usedCredits}
            additionalCredits={additionalCredits}
            onBuyMoreCredits={() => setIsPackagesDialogOpen(true)}
          />
        </div>

        <AnalysisPackagesDialog
          open={isPackagesDialogOpen}
          onOpenChange={setIsPackagesDialogOpen}
          onPackagePurchased={() => {
            // Refresh credits data after purchase
            // Could implement a refetch here
          }}
        />
      </div>
    </>
  );
}
