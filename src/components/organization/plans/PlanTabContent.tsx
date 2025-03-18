
import { useState, useEffect } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchPlanById } from "@/services/plans";
import { ChangePlanDialog } from "./ChangePlanDialog";
import { CurrentPlanCard } from "./CurrentPlanCard";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { mockPlans } from "@/mocks/plansMocks";

// Create a client
const queryClient = new QueryClient();

// Wrap component with QueryClientProvider
export function PlanTabContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlanTabContentInner />
    </QueryClientProvider>
  );
}

// Inner component that uses queries
function PlanTabContentInner() {
  const { user } = useUser();
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);
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

  if (!currentPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Não foi possível carregar as informações do plano.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <CurrentPlanCard 
        plan={currentPlan} 
        onChangePlan={() => setIsChangePlanDialogOpen(true)} 
        nextBillingDate={nextBillingDate}
      />

      {/* Plano Change Dialog */}
      <ChangePlanDialog 
        open={isChangePlanDialogOpen}
        onOpenChange={setIsChangePlanDialogOpen}
        currentPlan={currentPlan}
        availablePlans={mockPlans.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          shortDescription: plan.shortDescription || plan.description,
          description: plan.description,
          benefits: plan.benefits || plan.features,
          active: plan.active,
          stripeProductId: plan.stripeProductId,
          stripePriceId: plan.stripePriceId,
          credits: plan.credits
        }))}
      />
    </div>
  );
}
