
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { FieldProps } from "./types";

export function MaxAlertFrequencyField({ form, isEditing, enabledSettings, onToggle }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name="maxAlertFrequency"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Frequência Máxima de Alertas (horas)</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Determina o intervalo mínimo entre envios de alertas do mesmo tipo para uma empresa.
                       Evita o spam de notificações definindo um período de espera obrigatório entre alertas
                       similares.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CustomSwitch
              checked={enabledSettings.maxAlertFrequency}
              onCheckedChange={() => onToggle('maxAlertFrequency')}
            />
          </div>
          <FormControl>
            <Input 
              type="number" 
              {...field}
              disabled={!isEditing || !enabledSettings.maxAlertFrequency}
              className={(!isEditing || !enabledSettings.maxAlertFrequency) ? "bg-muted" : ""} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500 text-left pl-3">
            Intervalo mínimo entre alertas para a mesma empresa.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
