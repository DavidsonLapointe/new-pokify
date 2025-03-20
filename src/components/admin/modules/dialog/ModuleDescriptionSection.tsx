
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ModuleFormValues } from "../module-form-schema";

interface ModuleDescriptionSectionProps {
  form: UseFormReturn<ModuleFormValues>;
}

export const ModuleDescriptionSection: React.FC<ModuleDescriptionSectionProps> = ({ form }) => {
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição curta</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: Atendimento inteligente com IA para seus clientes"
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição completa</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: O Chat AI Assistente é um módulo que utiliza inteligência artificial para automatizar e aprimorar o atendimento ao cliente."
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefícios (um por linha)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={4} 
                placeholder="Ex: Atendimento 24/7 para seus clientes&#10;Redução de até 65% no tempo de resposta&#10;Integração com CRM e sistemas de atendimento&#10;Análise de sentimento e personalização de respostas"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="howItWorks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Como Funciona (um por linha)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={4} 
                placeholder="Ex: Instale o widget em seu site ou plataforma&#10;Configure as respostas e conhecimento base&#10;A IA aprende continuamente com as interações&#10;Relatórios detalhados de desempenho"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
