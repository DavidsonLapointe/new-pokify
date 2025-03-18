
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModuleSelector } from "../hooks/useModuleSelector";

interface ModuleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  modules?: { id: string; name: string; icon: string }[];
}

export const ModuleSelector = ({ value, onChange, modules: propModules }: ModuleSelectorProps) => {
  // Use our custom hook to get modules
  const { availableModules, isLoading } = useModuleSelector(propModules);

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
