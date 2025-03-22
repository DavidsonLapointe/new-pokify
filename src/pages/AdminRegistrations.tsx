
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { OrganizationsTable } from "@/components/admin/organizations/OrganizationsTable";
import { ActiveUsersDialog } from "@/components/admin/organizations/ActiveUsersDialog";
import { toast } from "sonner";
import { OrganizationsLoadingState } from "@/components/admin/organizations/OrganizationsLoadingState";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Organization } from "@/types";

const AdminRegistrations = () => {
  // State for organizations tab
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  
  // Fetch organizations data
  const { organizations, isLoading, error, refetch } = useOrganizations();

  const handleEditOrganization = (organization: Organization) => {
    console.log("Editando organização:", organization);
    setEditingOrganization(organization);
  };

  const handleUpdateOrganization = async (updatedOrg: Organization) => {
    try {
      console.log("Atualizando organização:", updatedOrg);
      
      setEditingOrganization(null);
      await refetch();
      toast.success("Empresa atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao processar atualização da organização:", err);
      toast.error("Erro ao atualizar empresa");
    }
  };

  const handleShowActiveUsers = (organization: Organization) => {
    console.log("Mostrando usuários ativos para:", organization.name);
    setSelectedOrganization(organization);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  // Garante que organizações esteja definido antes de filtrar
  const filteredOrganizations = organizations ? organizations.filter((org) =>
    [org.name, org.nomeFantasia, org.cnpj].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro 1</h1>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="areas" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="areas">Áreas</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="funcoes">Funções por tipo de usuário</TabsTrigger>
              <TabsTrigger value="minha-empresa">Minha Empresa</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="areas">
              <CardTitle>Áreas</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="empresas">
              <CardTitle>Empresas</CardTitle>
              <CardContent className="pt-4 px-0">
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
                    isEmpty={!organizations || organizations.length === 0}
                    onCreateNew={() => setIsCreateDialogOpen(true)}
                  />

                  {!isLoading && !error && organizations && organizations.length > 0 && (
                    <OrganizationsTable 
                      organizations={filteredOrganizations}
                      onEditOrganization={handleEditOrganization}
                      onShowActiveUsers={handleShowActiveUsers}
                    />
                  )}

                  <CreateOrganizationDialog 
                    open={isCreateDialogOpen} 
                    onOpenChange={setIsCreateDialogOpen}
                    onSuccess={handleCreateSuccess}
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
              </CardContent>
            </TabsContent>
            
            <TabsContent value="funcoes">
              <CardTitle>Funções por tipo de usuário</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="minha-empresa">
              <CardTitle>Minha Empresa</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="usuarios">
              <CardTitle>Usuários</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
