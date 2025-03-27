import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/realClient";

interface Plan {
  id: string | number;
  name: string;
  value: number;
  active: boolean;
  description?: string;
  short_description?: string;
  resources?: string;
  credit?: number;
  price_id?: string;
  prod_id?: string;
}

export function usePlans() {
  const { 
    data: plans = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['plans', 'active'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('planos')
          .select('*')
          .eq('active', true);
          
        if (error) {
          throw new Error(error.message);
        }
        
        return data || [];
      } catch (err) {
        console.error("Error fetching plans:", err);
        return [];
      }
    },
  });

  return {
    plans,
    isLoading,
    error
  };
}
