import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { moduleFormSchema, ModuleFormValues, standardAreas } from "./module-form-schema";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: Plan;
  onSave: (data: Partial<Plan>) => void;
}

export const ModuleDialog: React.FC<ModuleDialogProps> = ({
  open,
  onOpenChange,
  module,
  onSave
}) => {
  const isEditing = !!module;
  
  // Inicializar o formulário com react-hook-form
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      name: module?.name || "",
      price: module?.price ? module.price.toString() : "",
      shortDescription: module?.shortDescription || "",
      description: module?.description || "",
      benefits: Array.isArray(module?.benefits) ? module.benefits.join("\n") : "",
      howItWorks: Array.isArray(module?.howItWorks) ? module.howItWorks.join("\n") : "",
      active: module?.active !== undefined ? module.active : true,
      comingSoon: module?.comingSoon || false,
      icon: module?.icon || "MessageCircle",
      actionButtonText: module?.actionButtonText || "Contratar",
      credits: module?.credits || null,
      areas: module?.areas || [],
    }
  });

  // Efeito para atualizar o formulário quando o módulo muda
  useEffect(() => {
    if (module) {
      form.reset({
        name: module.name,
        price: module.price.toString(),
        shortDescription: module.shortDescription || "",
        description: module.description || "",
        benefits: Array.isArray(module.benefits) ? module.benefits.join("\n") : "",
        howItWorks: Array.isArray(module.howItWorks) ? module.howItWorks.join("\n") : "",
        active: module.active,
        comingSoon: module.comingSoon || false,
        icon: module.icon || "MessageCircle",
        actionButtonText: module.actionButtonText || "Contratar",
        credits: module.credits || null,
        areas: module.areas || [],
      });
    } else {
      form.reset({
        name: "",
        price: "",
        shortDescription: "",
        description: "",
        benefits: "",
        howItWorks: "",
        active: true,
        comingSoon: false,
        icon: "MessageCircle",
        actionButtonText: "Contratar",
        credits: null,
        areas: [],
      });
    }
  }, [module, form]);

  // Função submit que processa o formulário
  const onSubmit = async (values: ModuleFormValues) => {
    try {
      // Converter valores do formulário para o formato esperado
      const formattedValues: Partial<Plan> = {
        ...values,
        price: parseFloat(values.price),
        benefits: values.benefits.split("\n").filter(b => b.trim()),
        howItWorks: values.howItWorks.split("\n").filter(hw => hw.trim()),
        areas: values.areas,
      };
      
      await onSave(formattedValues);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast.error("Ocorreu um erro ao salvar o módulo.");
    }
  };

  // Adicionar uma área à lista de áreas selecionadas
  const handleAddArea = (areaId: string) => {
    const currentAreas = form.getValues().areas || [];
    if (!currentAreas.includes(areaId)) {
      form.setValue('areas', [...currentAreas, areaId]);
    }
  };

  // Remover uma área da lista de áreas selecionadas
  const handleRemoveArea = (areaId: string) => {
    const currentAreas = form.getValues().areas || [];
    form.setValue('areas', currentAreas.filter(id => id !== areaId));
  };

  // Seleção de ícone simplificada
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

  // Filtrar apenas áreas padrão
  const defaultAreas = standardAreas.filter(area => area.isDefault);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto py-4">
        <DialogHeader className="py-1">
          <DialogTitle>{isEditing ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do módulo conforme necessário."
              : "Preencha as informações do novo módulo."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Separator className="my-2" />

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
              
              {/* Área para seleção de áreas da empresa - posicionada logo após o valor do setup */}
              <FormField
                control={form.control}
                name="areas"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Áreas da Empresa</FormLabel>
                    <div className="text-xs text-gray-500 -mt-1 mb-2">
                      Selecione as áreas da empresa que este módulo atende.
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value.map((areaId) => {
                          const area = standardAreas.find(a => a.id === areaId);
                          if (!area) return null;
                          
                          return (
                            <Badge 
                              key={area.id} 
                              variant="secondary"
                              className="px-2.5 py-1 flex items-center bg-[#9b87f5] text-white"
                            >
                              {area.name}
                              <button 
                                type="button"
                                className="ml-1.5 text-white hover:text-gray-200 focus:outline-none"
                                onClick={() => handleRemoveArea(area.id)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </Badge>
                          );
                        })}
                        {field.value.length === 0 && (
                          <div className="text-sm text-gray-500">
                            Nenhuma área selecionada
                          </div>
                        )}
                      </div>
                      <Select
                        onValueChange={(value) => handleAddArea(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultAreas.map((area) => (
                            <SelectItem
                              key={area.id}
                              value={area.id}
                              disabled={field.value.includes(area.id)}
                            >
                              <div className="flex items-center">
                                <span>{area.name}</span>
                                {field.value.includes(area.id) && (
                                  <CheckIcon className="ml-auto h-4 w-4 text-primary" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500">
                        Selecione as áreas da empresa que este módulo atende.
                      </div>
                    </div>
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

            <Separator className="my-2" />

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

            <div className="flex justify-end gap-4 pt-2">
              <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary">
                {isEditing ? "Salvar Alterações" : "Criar Módulo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
