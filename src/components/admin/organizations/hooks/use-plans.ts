
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/plans/planFetchService";

export function usePlans() {
  const { 
    data: plans = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['plans', 'active'],
    queryFn: fetchPlans,
  });

  // Filter for active plans only
  const activePlans = plans.filter(plan => plan.active);

  return {
    plans: activePlans,
    isLoading,
    error
  };
}
