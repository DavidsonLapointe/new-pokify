
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  setIsCreateDialogOpen: (open: boolean) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ setIsCreateDialogOpen }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Módulos</h1>
        <p className="text-muted-foreground">
          Gerencie as ferramentas de IA disponíveis no sistema
        </p>
      </div>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Módulo
      </Button>
    </div>
  );
};
