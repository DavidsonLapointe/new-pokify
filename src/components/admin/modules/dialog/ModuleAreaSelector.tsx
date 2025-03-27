import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ModuleFormValues, CompanyArea } from "../module-form-schema";
import { fetchDefaultAreas, fetchAreas } from "@/services/areasService";

interface ModuleAreaSelectorProps {
  form: UseFormReturn<ModuleFormValues>;
  handleAddArea: (areaId: string) => void;
  handleRemoveArea: (areaId: string) => void;
}

export const ModuleAreaSelector: React.FC<ModuleAreaSelectorProps> = ({ 
  form, 
  handleAddArea, 
  handleRemoveArea 
}) => {
  const [areas, setAreas] = useState<CompanyArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        setIsLoading(true);
        // Fetch default areas from the database
        const dbAreas = await fetchDefaultAreas();
        setAreas(dbAreas);
      } catch (error) {
        console.error('Error loading areas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAreas();
  }, []);

  // Helper function to find area by ID
  const getAreaById = (areaId: string): CompanyArea | undefined => {
    return areas.find(a => a.id === areaId);
  };

  return (
    <FormField
      control={form.control}
      name="areas"
      render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>
            Áreas da Empresa <span className="font-normal text-gray-500">(selecione as áreas da empresa que este módulo atende)</span>
          </FormLabel>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {isLoading ? (
                <div className="text-sm text-gray-500">
                  Carregando áreas...
                </div>
              ) : field.value.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Nenhuma área selecionada
                </div>
              ) : (
                field.value.map((areaId) => {
                  const area = getAreaById(areaId);
                  if (!area) return null;
                  
                  return (
                    <Badge 
                      key={area.id} 
                      variant="secondary"
                      className="px-2.5 py-1 flex items-center bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
                    >
                      {area.name}
                      <button 
                        type="button"
                        className="ml-1.5 text-white hover:text-gray-200 focus:outline-none"
                        onClick={() => handleRemoveArea(area.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  );
                })
              )}
            </div>
            {isLoading ? (
              <div className="h-10 flex items-center border rounded px-3 text-sm text-gray-500">
                Carregando áreas...
              </div>
            ) : (
              <Select
                onValueChange={(value) => handleAddArea(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem
                      key={area.id}
                      value={area.id}
                      disabled={field.value.includes(area.id)}
                    >
                      <div className="flex items-center">
                        <span>{area.name}</span>
                        {field.value.includes(area.id) && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
