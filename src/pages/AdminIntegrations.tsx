
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminIntegrationsList } from "@/components/admin/integrations/AdminIntegrationsList";
import { CreateIntegrationDialog } from "@/components/admin/integrations/CreateIntegrationDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminIntegrations = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as integrações disponíveis para as empresas
          </p>
        </div>
        {activeTab === "clients" && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Integração
          </Button>
        )}
      </div>

      <Tabs 
        defaultValue="clients" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="central">Integrações Centrais</TabsTrigger>
          <TabsTrigger value="clients">Integrações Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <AdminIntegrationsList />
        </TabsContent>
        
        <TabsContent value="central">
          <div className="bg-muted/40 rounded-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Configuração de Integrações Centrais</h3>
            <p className="text-muted-foreground">
              Esta área permite configurar integrações que afetam todo o sistema.
              <br />Funcionalidade em desenvolvimento.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <CreateIntegrationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};

export default AdminIntegrations;
