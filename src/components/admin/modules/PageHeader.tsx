
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { standardAreas } from "@/components/admin/modules/module-form-schema";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  setIsCreateDialogOpen: (open: boolean) => void;
  activeAreaFilter: string | null;
  setActiveAreaFilter: (areaId: string | null) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  setIsCreateDialogOpen, 
  activeAreaFilter,
  setActiveAreaFilter 
}) => {
  // Filter only default areas
  const defaultAreas = standardAreas.filter(area => area.isDefault);

  const handleAreaFilterClick = (areaId: string) => {
    if (activeAreaFilter === areaId) {
      // If the same filter is clicked twice, clear it
      setActiveAreaFilter(null);
    } else {
      setActiveAreaFilter(areaId);
    }
  };

  const clearFilter = () => {
    setActiveAreaFilter(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
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
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm text-muted-foreground mr-2">Filtrar por área:</div>
        <div className="flex flex-wrap gap-1.5">
          {defaultAreas.map((area) => (
            <Badge
              key={area.id}
              variant={activeAreaFilter === area.id ? "default" : "outline"}
              className={`
                px-2.5 py-1 text-xs cursor-pointer
                ${activeAreaFilter === area.id 
                  ? "bg-primary hover:bg-primary-hover" 
                  : "hover:bg-gray-100 text-gray-700"}
              `}
              onClick={() => handleAreaFilterClick(area.id)}
            >
              {area.name}
            </Badge>
          ))}
          
          {activeAreaFilter && (
            <Badge 
              variant="outline" 
              className="px-2 py-1 text-xs cursor-pointer flex items-center gap-1 hover:bg-gray-100 text-gray-700"
              onClick={clearFilter}
            >
              <X className="w-3 h-3" />
              Limpar
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
