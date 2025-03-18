
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModulesManagement } from "@/components/admin/modules/hooks/useModulesManagement";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { useMemo } from "react";

interface ModuleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  modules?: { id: string; name: string; icon: string }[];
}

export const ModuleSelector = ({ value, onChange, modules: propModules }: ModuleSelectorProps) => {
  // Fetch modules from the admin module system
  const { modules, isLoading } = useModulesManagement();
  
  // Combine provided modules with system modules, or use system modules if none provided
  const availableModules = useMemo(() => {
    if (propModules && propModules.length > 0) {
      return propModules;
    }
    
    // Map system modules to the expected format
    return modules.map((module: Plan) => ({
      id: module.id.toString(),
      name: module.name,
      icon: module.icon || "MessageCircle"
    }));
  }, [modules, propModules]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Módulo
      </label>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Carregando módulos..." : "Selecione um módulo"} />
        </SelectTrigger>
        <SelectContent>
          {availableModules.map((module) => (
            <SelectItem key={module.id} value={module.id}>
              {module.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
