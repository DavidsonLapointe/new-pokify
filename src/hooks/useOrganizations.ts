
import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatOrganizationData } from "@/utils/organizationUtils";

export const useOrganizations = () => {
  const fetchOrganizations = async (): Promise<Organization[]> => {
    try {
      console.log("=== INICIANDO BUSCA DE ORGANIZAÇÕES ===");
      
      // Verificar se a sessão atual e o usuário logado
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Erro ao obter sessão atual:", sessionError);
        throw new Error(`Falha ao verificar autenticação: ${sessionError.message}`);
      }
      
      // Fetch all plans to map IDs to names
      console.log("Buscando planos para mapear IDs para nomes");
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('id, name');
        
      if (plansError) {
        console.error("Erro ao buscar planos:", plansError);
        throw new Error(`Falha ao carregar planos: ${plansError.message}`);
      }
      
      // Create map of plan ID to plan name
      const planIdToNameMap = new Map();
      if (plansData) {
        plansData.forEach(plan => {
          planIdToNameMap.set(plan.id, plan.name);
        });
      }
      
      // Fetch organizations from Supabase with debug logs
      console.log("Executando query para buscar organizações");
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          *,
          plans:plan(*)
        `)
        .order('created_at', { ascending: false });
      
      if (orgsError) {
        console.error("Erro ao buscar organizações:", orgsError);
        throw orgsError;
      }

      if (!orgsData) {
        console.log("Nenhuma organização encontrada");
        return [];
      }

      // Also need to fetch users for each organization
      const organizationsWithUsers = await Promise.all(
        orgsData.map(async (org) => {
          try {
            const { data: users, error: usersError } = await supabase
              .from('profiles')
              .select('*')
              .eq('organization_id', org.id);

            if (usersError) throw usersError;

            // Safe plan name access with proper type handling
            let planName = "Plano não encontrado";
            
            if (org.plans) {
              // Use type assertions to handle the 'name' property safely
              const planObject = org.plans as any;
              if (planObject && typeof planObject === 'object' && 'name' in planObject) {
                planName = planObject.name || planIdToNameMap.get(org.plan) || "Plano não encontrado";
              }
            } else {
              // Fallback to map if org.plans is null
              planName = planIdToNameMap.get(org.plan) || "Plano não encontrado";
            }

            const formattedOrg = formatOrganizationData({
              ...org,
              users: users || [],
              planName
            });
            
            return formattedOrg;
          } catch (err) {
            console.error(`Erro ao processar organização ${org.id}:`, err);
            return formatOrganizationData({
              ...org,
              users: [],
              planName: planIdToNameMap.get(org.plan) || "Plano não encontrado"
            });
          }
        })
      );

      return organizationsWithUsers;
    } catch (err) {
      console.error("Erro em fetchOrganizations:", err);
      throw err;
    }
  };

  return useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};
