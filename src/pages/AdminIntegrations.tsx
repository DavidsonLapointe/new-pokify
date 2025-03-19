
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminIntegrationsList } from "@/components/admin/integrations/AdminIntegrationsList";
import { CreateIntegrationDialog } from "@/components/admin/integrations/CreateIntegrationDialog";
import { CreateCentralIntegrationDialog } from "@/components/admin/integrations/CreateCentralIntegrationDialog";
import { CentralIntegrationsList } from "@/components/admin/integrations/CentralIntegrationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Integration } from "@/types/integration";
import { mockCentralIntegrations } from "@/mocks";

const AdminIntegrations = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateCentralDialogOpen, setIsCreateCentralDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("central");
  const [centralIntegrations, setCentralIntegrations] = useState<Integration[]>(mockCentralIntegrations);

  const handleCentralIntegrationCreated = (integration: Integration) => {
    setCentralIntegrations([...centralIntegrations, integration]);
  };

  const handleUpdateCentralIntegration = (updatedIntegration: Integration) => {
    setCentralIntegrations(
      centralIntegrations.map(integration => 
        integration.id === updatedIntegration.id ? updatedIntegration : integration
      )
    );
  };

  const handleDeleteCentralIntegration = (id: string) => {
    setCentralIntegrations(centralIntegrations.filter(integration => integration.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as integrações disponíveis para as empresas
          </p>
        </div>
        {activeTab === "central" && (
          <Button onClick={() => setIsCreateCentralDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Integração Central
          </Button>
        )}
        {activeTab === "clients" && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Integração
          </Button>
        )}
      </div>

      <Tabs 
        defaultValue="central" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="central">Integrações Centrais</TabsTrigger>
          <TabsTrigger value="clients">Integrações Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="central">
          <CentralIntegrationsList 
            integrations={centralIntegrations} 
            onUpdateIntegration={handleUpdateCentralIntegration} 
            onDeleteIntegration={handleDeleteCentralIntegration} 
          />
        </TabsContent>
        
        <TabsContent value="clients">
          <AdminIntegrationsList />
        </TabsContent>
      </Tabs>
      
      <CreateIntegrationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />

      <CreateCentralIntegrationDialog
        open={isCreateCentralDialogOpen}
        onOpenChange={setIsCreateCentralDialogOpen}
        onIntegrationCreated={handleCentralIntegrationCreated}
      />
    </div>
  );
};

export default AdminIntegrations;
