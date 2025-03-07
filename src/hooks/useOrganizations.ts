
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
      
      console.log("Sessão atual:", sessionData.session ? "Autenticado" : "Não autenticado");
      if (sessionData.session) {
        console.log("Usuário ID:", sessionData.session.user.id);
        
        // Verificar o perfil do usuário para confirmar que é leadly_employee
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (profileError) {
          console.error("Erro ao verificar perfil do usuário:", profileError);
        } else {
          console.log("Função do usuário:", profileData?.role);
        }
      }
      
      // Buscar todos os planos para mapear IDs para nomes
      console.log("Buscando planos para mapear IDs para nomes");
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('id, name');
        
      if (plansError) {
        console.error("Erro ao buscar planos:", plansError);
        throw new Error(`Falha ao carregar planos: ${plansError.message}`);
      }
      
      // Criar mapa de ID do plano para nome do plano
      const planIdToNameMap = new Map();
      if (plansData) {
        plansData.forEach(plan => {
          planIdToNameMap.set(plan.id, plan.name);
        });
      }
      console.log("Mapa de planos:", Object.fromEntries(planIdToNameMap));
      
      // Fetch organizations from Supabase with debug logs
      console.log("Executando query para buscar organizações");
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Verificar se houve erro na consulta
      if (orgsError) {
        console.error("Erro ao buscar organizações:", orgsError);
        if (orgsError.code === "PGRST301") {
          console.error("Erro de permissão! Verifique as políticas RLS no Supabase.");
        }
        throw new Error(`Falha ao carregar empresas: ${orgsError.message}`);
      }

      // Logar os dados brutos recebidos
      console.log("Dados brutos recebidos do Supabase:", orgsData);
      console.log("Quantidade de organizações recebidas:", orgsData?.length || 0);

      if (!orgsData || orgsData.length === 0) {
        console.log("Nenhuma organização encontrada no banco de dados");
        return [];
      }

      // Also need to fetch users for each organization
      const organizationsWithUsers = await Promise.all(
        orgsData.map(async (org) => {
          try {
            console.log(`Buscando usuários para a organização: ${org.id} (${org.name})`);
            
            const { data: users, error: usersError } = await supabase
              .from('profiles')
              .select('*')
              .eq('organization_id', org.id);

            if (usersError) {
              console.error(`Erro ao buscar usuários para organização ${org.id}:`, usersError);
              return formatOrganizationData({
                ...org,
                users: [],
                // Adicionar o nome do plano aqui
                planName: planIdToNameMap.get(org.plan) || "Plano desconhecido"
              });
            }

            console.log(`Encontrados ${users?.length || 0} usuários para a organização ${org.id}`);
            
            // Formatar e retornar os dados da organização com usuários
            const formattedOrg = formatOrganizationData({
              ...org,
              users: users || [],
              // Adicionar o nome do plano aqui
              planName: planIdToNameMap.get(org.plan) || "Plano desconhecido"
            });
            
            console.log(`Organização formatada: ${formattedOrg.name}`, formattedOrg);
            return formattedOrg;
          } catch (err) {
            console.error(`Erro ao processar organização ${org.id}:`, err);
            return formatOrganizationData({
              ...org,
              users: [],
              // Adicionar o nome do plano aqui em caso de erro
              planName: planIdToNameMap.get(org.plan) || "Plano desconhecido"
            });
          }
        })
      );

      console.log("Processamento completo. Total de organizações formatadas:", organizationsWithUsers.length);
      return organizationsWithUsers;
    } catch (err) {
      console.error("Erro em fetchOrganizations:", err);
      throw err;
    }
  };

  const { 
    data: organizations = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    staleTime: 0, // Desabilitar cache para sempre buscar dados novos
    refetchOnWindowFocus: true,
    retry: 5, // Aumentar número de tentativas
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  return {
    organizations,
    isLoading,
    error,
    refetch
  };
};
