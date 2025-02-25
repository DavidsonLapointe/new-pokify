
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { FieldProps } from "./types";

export const LLMCreditThresholdField = ({ form, isEditing, enabledSettings, onToggle }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name="llmCreditThreshold"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Threshold de Alerta de Créditos LLM (%)</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentual mínimo de créditos restantes no serviço de LLM da empresa 
                       que, quando atingido, dispara alertas automáticos. Por exemplo: 15% 
                       significa que o alerta será enviado quando restar apenas 15% dos 
                       créditos do modelo LLM.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CustomSwitch
              checked={enabledSettings.llmCreditThreshold}
              onCheckedChange={() => onToggle('llmCreditThreshold')}
            />
          </div>
          <FormControl>
            <Input 
              type="number" 
              {...field}
              disabled={!isEditing || !enabledSettings.llmCreditThreshold}
              className={(!isEditing || !enabledSettings.llmCreditThreshold) ? "bg-muted" : ""} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500 text-left pl-3">
            Porcentagem mínima de créditos LLM para disparar alerta.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
