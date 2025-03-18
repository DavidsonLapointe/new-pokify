
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleSetupsList } from "@/components/admin/modules/ModuleSetupsList";
import { SetupStatus } from "@/components/organization/modules/types";
import { toast } from "sonner";

const AdminModuleSetups = () => {
  // Handler for when the status of a setup is changed
  const handleSetupStatusChange = (
    setupId: string, 
    moduleId: string, 
    organizationId: string, 
    newStatus: SetupStatus
  ) => {
    console.log(`Setup ${setupId} para o módulo ${moduleId} da organização ${organizationId} foi atualizado para ${newStatus}`);
    
    // Here you could add logic to update global state or make an API call
    // When status is "completed", this should change the module status to "contracted" for the organization
    if (newStatus === "completed") {
      toast.success(`O módulo ${moduleId} foi configurado e agora está disponível para a organização ${organizationId}`);
      // In a real environment, this would be done through an API
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Setups</h1>
        <p className="text-sm text-muted-foreground">Lista de Implantações Pendentes e em Andamento</p>
      </div>
      <Card className="border-0 shadow-none">
        <CardContent className="pt-6">
          <TooltipProvider>
            <ModuleSetupsList onStatusChange={handleSetupStatusChange} />
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModuleSetups;
