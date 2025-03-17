
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleSetupsList } from "@/components/admin/modules/ModuleSetupsList";

const AdminModuleSetups = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Implantações de Setup</h1>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Lista de Implantações Pendentes e em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <ModuleSetupsList />
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModuleSetups;
