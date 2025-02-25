
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { FieldProps } from "./types";

export function MaxAnalysisRetriesField({ form, isEditing, enabledSettings, onToggle }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name="maxAnalysisRetries"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Tentativas Máximas de Análise</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define quantas vezes o sistema tentará processar um arquivo em caso de falha.
                       Após atingir este limite, o arquivo será marcado como falha permanente e
                       precisará ser submetido novamente.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CustomSwitch
              checked={enabledSettings.maxAnalysisRetries}
              onCheckedChange={() => onToggle('maxAnalysisRetries')}
            />
          </div>
          <FormControl>
            <Input 
              type="number" 
              {...field}
              disabled={!isEditing || !enabledSettings.maxAnalysisRetries}
              className={(!isEditing || !enabledSettings.maxAnalysisRetries) ? "bg-muted" : ""} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500 text-left pl-3">
            Número máximo de tentativas para análise de um arquivo.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
