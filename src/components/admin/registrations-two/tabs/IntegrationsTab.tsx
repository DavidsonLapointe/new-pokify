
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminIntegrationsList } from "@/components/admin/integrations/AdminIntegrationsList";
import { CreateIntegrationDialog } from "@/components/admin/integrations/CreateIntegrationDialog";
import { CreateCentralIntegrationDialog } from "@/components/admin/integrations/CreateCentralIntegrationDialog";
import { CentralIntegrationsList } from "@/components/admin/integrations/CentralIntegrationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Integration } from "@/types/integration";
import { mockCentralIntegrations } from "@/mocks/integrationsMocks";

export const IntegrationsTab = () => {
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
    <div className="text-left p-6"> {/* Added padding to match other tabs */}
      <div className="flex items-center justify-between mb-6"> {/* Added margin bottom */}
        <div>
          <h2 className="text-2xl font-semibold mb-1">Integrações</h2> {/* Proper heading style */}
          <p className="text-muted-foreground mt-1">
            Gerencie as integrações disponíveis
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
            Nova Integração Clientes
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
