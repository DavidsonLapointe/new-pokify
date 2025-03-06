
import React, { useState, useEffect } from "react";
import { Organization } from "@/types";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { OrganizationsTable } from "@/components/admin/organizations/OrganizationsTable";
import { ActiveUsersDialog } from "@/components/admin/organizations/ActiveUsersDialog";
import { toast } from "sonner";
import { OrganizationsLoadingState } from "@/components/admin/organizations/OrganizationsLoadingState";
import { useOrganizations } from "@/hooks/useOrganizations";

const Organizations = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  
  // Fetch organizations data
  const { organizations, isLoading, error, refetch } = useOrganizations();

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

  const handleUpdateOrganization = async (updatedOrg: Organization) => {
    try {
      console.log("Atualizando organização:", updatedOrg);
      
      // The updated data will be automatically refetched by React Query
      setEditingOrganization(null);
      await refetch(); // Explicitamente refetching após atualização
      toast.success("Empresa atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao processar atualização da organização:", err);
      toast.error("Erro ao atualizar empresa");
    }
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

      <OrganizationsLoadingState
        isLoading={isLoading}
        error={error as Error | null}
        refetch={refetch}
        isEmpty={organizations.length === 0}
        onCreateNew={() => setIsCreateDialogOpen(true)}
      />

      {!isLoading && !error && organizations.length > 0 && (
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
