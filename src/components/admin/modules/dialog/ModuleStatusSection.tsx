
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { UseFormReturn } from "react-hook-form";
import { ModuleFormValues } from "../module-form-schema";

interface ModuleStatusSectionProps {
  form: UseFormReturn<ModuleFormValues>;
}

export const ModuleStatusSection: React.FC<ModuleStatusSectionProps> = ({ form }) => {
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Status do Módulo</FormLabel>
              <div className="text-sm text-muted-foreground">
                {field.value ? "Módulo ativo" : "Módulo inativo"}
              </div>
            </div>
            <FormControl>
              <CustomSwitch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="comingSoon"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Em breve</FormLabel>
              <div className="text-sm text-muted-foreground">
                {field.value ? "Este módulo estará disponível em breve" : "Este módulo já está disponível"}
              </div>
            </div>
            <FormControl>
              <CustomSwitch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
