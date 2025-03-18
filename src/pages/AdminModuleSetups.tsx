
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleSetupsList } from "@/components/admin/modules/ModuleSetupsList";
import { SetupStatus } from "@/components/organization/modules/types";
import { toast } from "sonner";

const AdminModuleSetups = () => {
  // Handler para quando o status de um setup for alterado
  const handleSetupStatusChange = (
    setupId: string, 
    moduleId: string, 
    organizationId: string, 
    newStatus: SetupStatus
  ) => {
    console.log(`Setup ${setupId} para o módulo ${moduleId} da organização ${organizationId} foi atualizado para ${newStatus}`);
    
    // Aqui você pode adicionar a lógica para atualizar o estado global ou fazer uma chamada de API
    // Quando for "completed", isso deveria mudar o status do módulo para "contracted" na organização
    if (newStatus === "completed") {
      toast.success(`O módulo ${moduleId} foi configurado e agora está disponível para a organização ${organizationId}`);
      // Em um ambiente real, isso seria feito através de uma API
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Setups</h1>
        <p className="text-sm text-muted-foreground">Lista de Implantações Pendentes e em Andamento</p>
      </div>
      <Card className="border-t-0 rounded-t-none">
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
