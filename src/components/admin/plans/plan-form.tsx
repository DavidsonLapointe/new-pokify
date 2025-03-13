
import React from "react";
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
  AlertTriangle, MessageCircle, Video, Headphones, 
  UserRound, ShieldCheck, Check, Search,
  Bell, Brain, BookOpen, CreditCard, FileText, LineChart,
  Mail, Share2, Smartphone, Star, Zap, Briefcase
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PlanFormProps {
  form: UseFormReturn<PlanFormValues>;
  isEditing: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

// Expanded module icons list for more options
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
];

export function PlanForm({ form, isEditing, onSubmit, onCancel }: PlanFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Filter icons based on search term
  const filteredIcons = moduleIcons.filter(icon => 
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para lidar com a seleção de ícone
  const handleIconSelect = (value: string) => {
    form.setValue("icon", value);
    setSearchTerm("");
    setPopoverOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
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
                    <Star className="h-4 w-4 text-amber-500" />
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
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        {field.value && (
                          <>
                            {moduleIcons.find(i => i.value === field.value)?.icon && 
                              React.createElement(
                                moduleIcons.find(i => i.value === field.value)!.icon, 
                                { className: "h-4 w-4" }
                              )
                            }
                            <span>{moduleIcons.find(i => i.value === field.value)?.label}</span>
                          </>
                        )}
                        {!field.value && "Selecione um ícone"}
                      </div>
                      <Search className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Buscar ícone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {filteredIcons.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {filteredIcons.map(({ value, label, icon: Icon }) => (
                            <Button
                              key={value}
                              type="button"
                              variant={field.value === value ? "default" : "outline"}
                              className="justify-start gap-2 w-full h-auto py-2"
                              onClick={() => handleIconSelect(value)}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="truncate">{label}</span>
                              {field.value === value && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Nenhum ícone encontrado
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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
