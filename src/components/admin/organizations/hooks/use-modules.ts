import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/realClient";

interface Module {
  id: string | number;
  name: string;
  value: number;
  active: boolean;
  coming_soon: boolean;
  short_description?: string;
  long_description?: string;
  credit_per_use?: number;
  benefit?: string;
  how_works?: string;
  icone?: string;
  button_label?: string;
  price_id?: string;
  prod_id?: string;
  areas_ids?: string;
}

export function useModules() {
  const { 
    data: modules = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['modules', 'active'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('modulos')
          .select('*')
          .eq('active', true)
          .eq('coming_soon', false);
          
        if (error) {
          throw new Error(error.message);
        }
        
        return data || [];
      } catch (err) {
        console.error("Error fetching modules:", err);
        return [];
      }
    },
  });

  return {
    modules,
    isLoading,
    error
  };
}
