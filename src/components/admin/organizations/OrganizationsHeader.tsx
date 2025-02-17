
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrganizationsHeaderProps {
  onCreateNew: () => void;
}

export const OrganizationsHeader = ({ onCreateNew }: OrganizationsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">Empresas</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as empresas contratantes da plataforma
        </p>
      </div>
      <Button onClick={onCreateNew}>
        <Plus className="w-4 h-4 mr-2" />
        Nova Empresa
      </Button>
    </div>
  );
};
