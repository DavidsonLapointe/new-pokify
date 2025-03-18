
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface PromptTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptTypeSelector = ({ value, onChange }: PromptTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Tipo de Prompt
      </label>
      <div className="bg-muted/50 p-3 rounded-md mb-3 text-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Tipos de Prompt:</p>
            <p className="mb-1"><strong>Global:</strong> Disponível para todas as empresas no sistema. Útil para funcionalidades padrão que podem ser usadas por qualquer cliente.</p>
            <p><strong>Customizado:</strong> Específico para uma única empresa. Permite criar prompts personalizados para necessidades particulares de um cliente.</p>
          </div>
        </div>
      </div>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="global" id="global" />
          <Label htmlFor="global">Global</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Customizado</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
