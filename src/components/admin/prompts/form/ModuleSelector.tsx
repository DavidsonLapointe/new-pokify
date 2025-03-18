
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Module {
  id: string;
  name: string;
  icon: string;
}

interface ModuleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  modules: Module[];
}

export const ModuleSelector = ({ value, onChange, modules }: ModuleSelectorProps) => {
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
          <SelectValue placeholder="Selecione um módulo" />
        </SelectTrigger>
        <SelectContent>
          {modules.map((module) => (
            <SelectItem key={module.id} value={module.id}>
              {module.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
