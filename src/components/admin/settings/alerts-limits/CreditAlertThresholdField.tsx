
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { FieldProps } from "./types";

export function CreditAlertThresholdField({ form, isEditing, enabledSettings, onToggle }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name="creditAlertThreshold"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Threshold de Alerta de Créditos (%)</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define o percentual mínimo de créditos restantes que, quando atingido, 
                       dispara alertas automáticos para os administradores da empresa contratante. 
                       Por exemplo: 20% significa que o alerta será enviado quando restar apenas 20% dos créditos.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CustomSwitch
              checked={enabledSettings.creditAlertThreshold}
              onCheckedChange={() => onToggle('creditAlertThreshold')}
            />
          </div>
          <FormControl>
            <Input 
              type="number" 
              {...field}
              disabled={!isEditing || !enabledSettings.creditAlertThreshold}
              className={(!isEditing || !enabledSettings.creditAlertThreshold) ? "bg-muted" : ""} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500 text-left pl-3">
            Porcentagem mínima de créditos restantes para disparar alerta.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
