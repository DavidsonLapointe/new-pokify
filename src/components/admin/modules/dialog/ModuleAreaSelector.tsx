
import React from "react";
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
import { ModuleFormValues, CompanyArea, standardAreas } from "../module-form-schema";

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
  // Filtrar apenas áreas padrão
  const defaultAreas = standardAreas.filter(area => area.isDefault);

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
              {field.value.map((areaId) => {
                const area = standardAreas.find(a => a.id === areaId);
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
              })}
              {field.value.length === 0 && (
                <div className="text-sm text-gray-500">
                  Nenhuma área selecionada
                </div>
              )}
            </div>
            <Select
              onValueChange={(value) => handleAddArea(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma área" />
              </SelectTrigger>
              <SelectContent>
                {defaultAreas.map((area) => (
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
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
