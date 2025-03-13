import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type PlanFormValues } from "./plan-form-schema";
import { type UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, Video, Headphones, 
  UserRound, ShieldCheck, Check, Search,
  Bell, Brain, BookOpen, CreditCard, FileText, LineChart,
  Mail, Share2, Smartphone, Star, Zap, Briefcase, Clock, Package, Blocks, AppWindow
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PlanFormProps {
  form: UseFormReturn<PlanFormValues>;
  isEditing: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

// Simplified icon map with consistent typing
const moduleIcons = [
  { value: "MessageCircle", label: "Mensagem", icon: MessageCircle },
  { value: "Video", label: "Vídeo", icon: Video },
  { value: "Headphones", label: "Atendimento", icon: Headphones },
  { value: "UserRound", label: "Usuário", icon: UserRound },
  { value: "ShieldCheck", label: "Segurança", icon: ShieldCheck },
  { value: "Bell", label: "Notificação", icon: Bell },
  { value: "Brain", label: "IA", icon: Brain },
  { value: "BookOpen", label: "Conhecimento", icon: BookOpen },
  { value: "CreditCard", label: "Pagamento", icon: CreditCard },
  { value: "FileText", label: "Documentos", icon: FileText },
  { value: "LineChart", label: "Analytics", icon: LineChart },
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Share2", label: "Compartilhar", icon: Share2 },
  { value: "Smartphone", label: "Mobile", icon: Smartphone },
  { value: "Star", label: "Destaque", icon: Star },
  { value: "Zap", label: "Automação", icon: Zap },
  { value: "Briefcase", label: "Negócios", icon: Briefcase },
  { value: "Clock", label: "Em Breve", icon: Clock },
  { value: "Package", label: "Pacote", icon: Package },
  { value: "Blocks", label: "Blocos", icon: Blocks },
  { value: "AppWindow", label: "Aplicativo", icon: AppWindow },
];

export function PlanForm({ form, isEditing, onSubmit, onCancel }: PlanFormProps) {
  // Find icon function to safely render icon
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return null;
    const found = moduleIcons.find(item => item.value === iconName);
    if (!found) return null;
    const IconComponent = found.icon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Status do Módulo</FormLabel>
                  <div className="text-sm text-muted-foreground flex items-center space-x-2">
                    <span>{field.value ? "Módulo ativo" : "Módulo inativo"}</span>
                    <Badge 
                      variant="secondary"
                      className={`
                        ${field.value 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"}
                      `}
                    >
                      {field.value ? "Ativo" : "Inativo"}
                    </Badge>
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
              <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base flex items-center gap-2">
                    Módulo "Em Breve" 
                    <Clock className="h-4 w-4 text-amber-500" />
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Marque esta opção para exibir o módulo com status "Em Breve"
                  </div>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ícone do Módulo</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um ícone">
                        {field.value && (
                          <div className="flex items-center gap-2">
                            {getIconComponent(field.value)}
                            <span>{moduleIcons.find(i => i.value === field.value)?.label}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moduleIcons.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" min="0" />
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
                  <FormLabel>Texto do Botão de Ação</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Contratar, Criar vídeo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Breve</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Descreva brevemente o módulo em uma frase"
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
                <FormLabel>Descrição Longa</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Descreva em detalhes o que o módulo faz"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefícios (um por linha)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={5} 
                    placeholder="Ex: Aumento de 35% na taxa de resposta em comparação a e-mails convencionais"
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
                <FormLabel>Como Funciona (um passo por linha)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={5} 
                    placeholder="Ex: Importação de dados do lead a partir do seu CRM"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="cancel" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Salvar Alterações" : "Criar Módulo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
