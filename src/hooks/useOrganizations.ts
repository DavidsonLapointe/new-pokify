
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
        .select('id, name, price');
        
      if (plansError) {
        console.error("Erro ao buscar planos:", plansError);
        throw new Error(`Falha ao carregar planos: ${plansError.message}`);
      }
      
      // Create map of plan ID to plan name and price
      const planMap = new Map();
      if (plansData) {
        plansData.forEach(plan => {
          planMap.set(plan.id, { name: plan.name, price: plan.price });
        });
      }
      
      console.log("Mapa de planos criado:", Object.fromEntries(planMap));
      
      // Fetch organizations from Supabase with debug logs
      console.log("Executando query para buscar organizações");
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (orgsError) {
        console.error("Erro ao buscar organizações:", orgsError);
        throw orgsError;
      }

      if (!orgsData) {
        console.log("Nenhuma organização encontrada");
        return [];
      }

      console.log(`${orgsData.length} organizações encontradas`);

      // Also need to fetch users for each organization
      const organizationsWithUsers = await Promise.all(
        orgsData.map(async (org) => {
          try {
            console.log(`Processando organização: ${org.id} - ${org.name}`);
            
            const { data: users, error: usersError } = await supabase
              .from('profiles')
              .select('*')
              .eq('organization_id', org.id);

            if (usersError) {
              console.error(`Erro ao buscar usuários para organização ${org.id}:`, usersError);
              throw usersError;
            }

            // Get plan info from the map
            const planInfo = planMap.get(org.plan);
            const planName = planInfo ? planInfo.name : "Plano não encontrado";
            console.log(`Plano para organização ${org.id}: ${planName}`);

            // Formatando a organização com dados completos
            const formattedOrg = formatOrganizationData({
              ...org,
              users: users || [],
              planName
            });
            
            return formattedOrg;
          } catch (err) {
            console.error(`Erro ao processar organização ${org.id}:`, err);
            // Still return something to prevent Promise.all from failing
            return formatOrganizationData({
              ...org,
              users: [],
              planName: planMap.get(org.plan)?.name || "Plano não encontrado"
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
