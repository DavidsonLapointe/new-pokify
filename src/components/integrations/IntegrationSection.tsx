
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Integration } from "@/types/integration";
import { IntegrationCard } from "./IntegrationCard";

interface IntegrationSectionProps {
  type: "crm" | "call" | "llm";
  title: string;
  icon: React.ReactNode;
  availableTools: { id: string; name: string }[];
  isActive: boolean;
  selectedIntegration?: Integration;
  onSelect: (type: "crm" | "call" | "llm", integrationId: string) => void;
  onToggle: (integration: Integration) => void;
}

export const IntegrationSection = ({
  type,
  title,
  icon,
  availableTools,
  isActive,
  selectedIntegration,
  onSelect,
  onToggle,
}: IntegrationSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge
            variant={isActive ? "default" : "destructive"}
            className={`ml-2 ${isActive ? "bg-green-500 hover:bg-green-600" : ""}`}
          >
            {isActive ? "Ativo" : "Pendente"}
          </Badge>
        </div>
        <Select
          value={selectedIntegration?.id || ""}
          onValueChange={(value) => onSelect(type, value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar ferramenta" />
          </SelectTrigger>
          <SelectContent>
            {availableTools.map((tool) => (
              <SelectItem key={tool.id} value={tool.id}>
                {tool.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedIntegration && (
        <div className="mt-4">
          <IntegrationCard 
            integration={selectedIntegration} 
            onToggle={onToggle}
          />
        </div>
      )}
    </div>
  );
};
