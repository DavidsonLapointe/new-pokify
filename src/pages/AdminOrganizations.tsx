
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
    console.log("Iniciando busca de organizações");
    
    // Fetch organizations from Supabase
    const { data: orgsData, error: orgsError } = await supabase
      .from('organizations')
      .select(`
        id,
        name,
        nome_fantasia,
        plan,
        status,
        pending_reason,
        integrated_crm,
        integrated_llm,
        email,
        phone,
        cnpj,
        admin_name,
        admin_email,
        contract_signed_at,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (orgsError) {
      console.error("Erro ao buscar organizações:", orgsError);
      throw new Error("Falha ao carregar empresas. Tente novamente mais tarde.");
    }

    console.log("Organizações recebidas:", orgsData?.length || 0);

    if (!orgsData || orgsData.length === 0) {
      console.log("Nenhuma organização encontrada");
      return [];
    }

    // Also need to fetch users for each organization
    const organizationsWithUsers = await Promise.all(
      orgsData.map(async (org) => {
        try {
          console.log(`Buscando usuários para a organização: ${org.id}`);
          
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
          
          return formatOrganizationData({
            ...org,
            users: users || []
          });
        } catch (err) {
          console.error(`Erro ao processar organização ${org.id}:`, err);
          return formatOrganizationData({
            ...org,
            users: []
          });
        }
      })
    );

    console.log("Processamento completo. Total de organizações:", organizationsWithUsers.length);
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
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    retry: 3,
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
    console.log("Organizações carregadas:", organizations);
  }, [organizations]);

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    // The updated data will be automatically refetched by React Query
    setEditingOrganization(null);
    refetch(); // Explicitly refetch after update
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
