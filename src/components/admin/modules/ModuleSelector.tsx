
import React from "react";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { mockModules } from "@/components/admin/modules/module-constants";
import { iconMap } from "@/components/admin/modules/module-constants";
import { Label } from "@/components/ui/label";

interface ModuleSelectorProps {
  selectedModules: string[];
  onModuleChange: (moduleIds: string[]) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  selectedModules,
  onModuleChange,
}) => {
  // Filter only active modules that are not marked as coming soon
  const availableModules = mockModules.filter(
    (module) => module.active && !module.comingSoon
  );

  const handleModuleToggle = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      // Remove from selection
      onModuleChange(selectedModules.filter(id => id !== moduleId));
    } else {
      // Add to selection
      onModuleChange([...selectedModules, moduleId]);
    }
  };

  if (availableModules.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        Não há módulos disponíveis para seleção no momento.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {availableModules.map((module) => {
        const IconComponent = module.icon && iconMap[module.icon as keyof typeof iconMap];
        const isSelected = selectedModules.includes(module.id.toString());

        return (
          <div 
            key={module.id}
            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
              isSelected ? "bg-primary-lighter border-primary" : "hover:bg-gray-50"
            }`}
            onClick={() => handleModuleToggle(module.id.toString())}
          >
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={() => handleModuleToggle(module.id.toString())}
              className="mt-1"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {IconComponent && (
                  <div className="p-1 bg-primary-lighter rounded-md">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                )}
                <Label className="text-base font-medium cursor-pointer">{module.name}</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{module.shortDescription}</p>
              
              <div className="text-xs text-primary mt-1">
                R$ {module.price.toFixed(2)} (setup)
                {module.credits && (
                  <span className="ml-2 text-amber-700">
                    {module.credits} créditos por execução
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
