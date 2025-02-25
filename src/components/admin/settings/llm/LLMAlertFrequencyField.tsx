
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { FieldProps } from "./types";

export const LLMAlertFrequencyField = ({ form, isEditing, enabledSettings, onToggle }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name="llmAlertFrequency"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Frequência de Alertas LLM (horas)</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Intervalo mínimo entre envios de alertas relacionados ao saldo 
                       de LLM para uma mesma empresa. Evita o envio excessivo de 
                       notificações sobre o mesmo problema.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CustomSwitch
              checked={enabledSettings.llmAlertFrequency}
              onCheckedChange={() => onToggle('llmAlertFrequency')}
            />
          </div>
          <FormControl>
            <Input 
              type="number" 
              {...field}
              disabled={!isEditing || !enabledSettings.llmAlertFrequency}
              className={(!isEditing || !enabledSettings.llmAlertFrequency) ? "bg-muted" : ""} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500 text-left pl-3">
            Intervalo entre alertas de saldo LLM para a mesma empresa.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
