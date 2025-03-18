
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Organization } from "@/types";
import { mockModules, iconMap } from "@/components/admin/modules/module-constants";

interface ModulesSectionProps {
  organizationModules: string[];
}

export const ModulesSection = ({ organizationModules }: ModulesSectionProps) => {
  // Map module IDs to their names using the mockModules data
  const getModuleName = (moduleId: string) => {
    const module = mockModules.find(m => m.id.toString() === moduleId);
    return module ? module.name : moduleId;
  };

  // Get icon component for a module
  const getModuleIcon = (moduleId: string) => {
    const module = mockModules.find(m => m.id.toString() === moduleId);
    if (module && module.icon && iconMap[module.icon as keyof typeof iconMap]) {
      const IconComponent = iconMap[module.icon as keyof typeof iconMap];
      return <IconComponent className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Módulos Contratados</h3>
      {organizationModules.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {organizationModules.map((moduleId) => (
            <Badge 
              key={moduleId}
              variant="outline" 
              className="flex items-center gap-1 bg-primary-lighter"
            >
              {getModuleIcon(moduleId)}
              {getModuleName(moduleId)}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum módulo contratado.
        </p>
      )}
      <p className="text-xs text-muted-foreground italic mt-1">
        A contratação e cancelamento de módulos é realizada pelo usuário administrador da empresa.
      </p>
    </div>
  );
};
