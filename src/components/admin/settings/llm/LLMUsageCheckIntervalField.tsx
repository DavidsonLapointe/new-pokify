
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { FieldProps } from "./types";

export const LLMUsageCheckIntervalField = ({ form, isEditing, enabledSettings, onToggle }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name="llmUsageCheckInterval"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Intervalo de Verificação (minutos)</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Frequência com que o sistema verifica o saldo de créditos LLM 
                       das empresas. Um intervalo menor permite detecção mais rápida 
                       de problemas, mas pode aumentar o custo de requisições à API 
                       do provedor LLM.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CustomSwitch
              checked={enabledSettings.llmUsageCheckInterval}
              onCheckedChange={() => onToggle('llmUsageCheckInterval')}
            />
          </div>
          <FormControl>
            <Input 
              type="number" 
              {...field}
              disabled={!isEditing || !enabledSettings.llmUsageCheckInterval}
              className={(!isEditing || !enabledSettings.llmUsageCheckInterval) ? "bg-muted" : ""} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500 text-left pl-3">
            Frequência de verificação do saldo de créditos LLM.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
