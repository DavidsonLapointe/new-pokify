
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminIntegrationsList } from "@/components/admin/integrations/AdminIntegrationsList";
import { CreateIntegrationDialog } from "@/components/admin/integrations/CreateIntegrationDialog";

const AdminIntegrations = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Gerencie as integrações disponíveis para as empresas
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <AdminIntegrationsList />
      
      <CreateIntegrationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};

export default AdminIntegrations;
