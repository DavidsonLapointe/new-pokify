
import React, { useState, useEffect } from "react";
import { Organization } from "@/types";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { OrganizationsTable } from "@/components/admin/organizations/OrganizationsTable";
import { ActiveUsersDialog } from "@/components/admin/organizations/ActiveUsersDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatOrganizationData } from "@/utils/userUtils";

const fetchOrganizations = async (): Promise<Organization[]> => {
  try {
    console.log("=== INICIANDO BUSCA DE ORGANIZAÇÕES ===");
    
    // Verificar se a conexão com o Supabase está funcionando
    try {
      const { data: testData, error: testError } = await supabase.from('profiles').select('count').limit(1);
      if (testError) {
        console.error("Erro na conexão com Supabase:", testError);
      } else {
        console.log("Conexão com Supabase OK, testData:", testData);
      }
    } catch (connErr) {
      console.error("Erro ao testar conexão com Supabase:", connErr);
    }
    
    // Fetch organizations from Supabase with debug logs
    console.log("Executando query para buscar organizações");
    const { data: orgsData, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Verificar se houve erro na consulta
    if (orgsError) {
      console.error("Erro ao buscar organizações:", orgsError);
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
              users: []
            });
          }

          console.log(`Encontrados ${users?.length || 0} usuários para a organização ${org.id}`);
          
          // Formatar e retornar os dados da organização com usuários
          const formattedOrg = formatOrganizationData({
            ...org,
            users: users || []
          });
          
          console.log(`Organização formatada: ${formattedOrg.name}`, formattedOrg);
          return formattedOrg;
        } catch (err) {
          console.error(`Erro ao processar organização ${org.id}:`, err);
          return formatOrganizationData({
            ...org,
            users: []
          });
        }
      })
    );

    console.log("Processamento completo. Total de organizações formatadas:", organizationsWithUsers.length);
    console.log("Organizações processadas:", organizationsWithUsers);
    return organizationsWithUsers;
  } catch (err) {
    console.error("Erro em fetchOrganizations:", err);
    throw err;
  }
};

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // Use React Query to fetch and manage organizations data
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

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      console.error("Erro ao buscar organizações:", error);
      toast.error("Erro ao carregar organizações: " + (error as Error).message);
    }
  }, [error]);

  // Adicionar log para verificar os dados carregados
  useEffect(() => {
    console.log("Organizações carregadas no componente:", organizations);
  }, [organizations]);

  // Trigger manual load when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Carregando organizações manualmente...");
        await refetch();
      } catch (err) {
        console.error("Erro ao recarregar organizações:", err);
      }
    };
    
    loadData();
  }, [refetch]);

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    // The updated data will be automatically refetched by React Query
    setEditingOrganization(null);
    refetch(); // Explicitamente refetching após atualização
    toast.success("Empresa atualizada com sucesso!");
  };

  const handleShowActiveUsers = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  const filteredOrganizations = organizations.filter((org) =>
    [org.name, org.nomeFantasia, org.cnpj].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <OrganizationsHeader onCreateNew={() => setIsCreateDialogOpen(true)} />
      
      <OrganizationsSearch 
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando empresas...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">Falha ao carregar empresas</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      ) : organizations.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-muted-foreground mb-4">Nenhuma empresa encontrada</p>
          <button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Cadastrar Empresa
          </button>
        </div>
      ) : (
        <OrganizationsTable 
          organizations={filteredOrganizations}
          onEditOrganization={handleEditOrganization}
          onShowActiveUsers={handleShowActiveUsers}
        />
      )}

      <CreateOrganizationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />

      {editingOrganization && (
        <EditOrganizationDialog
          open={!!editingOrganization}
          onOpenChange={(open) => !open && setEditingOrganization(null)}
          organization={editingOrganization}
          onSave={handleUpdateOrganization}
        />
      )}

      <ActiveUsersDialog
        organization={selectedOrganization}
        onClose={() => setSelectedOrganization(null)}
      />
    </div>
  );
};

export default Organizations;
