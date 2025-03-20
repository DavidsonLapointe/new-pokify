
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ModuleFormValues } from "../module-form-schema";

interface ModuleBasicInfoSectionProps {
  form: UseFormReturn<ModuleFormValues>;
}

export const ModuleBasicInfoSection: React.FC<ModuleBasicInfoSectionProps> = ({ form }) => {
  // Icon options for the module
  const iconOptions = [
    { value: "MessageCircle", label: "Chat" },
    { value: "Video", label: "Vídeo" },
    { value: "Headphones", label: "Áudio" },
    { value: "UserRound", label: "Usuário" },
    { value: "LineChart", label: "Gráfico" },
    { value: "Brain", label: "IA" },
    { value: "BookOpen", label: "Conhecimento" },
    { value: "CreditCard", label: "Pagamento" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Módulo</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do Setup (R$)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="credits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Créditos por execução</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                value={field.value || ''} 
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="icon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ícone</FormLabel>
            <FormControl>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...field}
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="actionButtonText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto do botão de ação</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
