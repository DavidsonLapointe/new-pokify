
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  maxUsers: z.string().regex(/^\d+$/, "Número inválido"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  features: z.string().min(1, "Adicione pelo menos um recurso"),
  active: z.boolean(),
});

interface EditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: any;
  onSave: (data: any) => void;
}

export const EditPlanDialog = ({ open, onOpenChange, plan, onSave }: EditPlanDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!plan;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan?.name || "",
      price: plan?.price?.toString() || "",
      maxUsers: plan?.maxUsers?.toString() || "",
      description: plan?.description || "",
      features: plan?.features?.join("\n") || "",
      active: plan?.active ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formattedValues = {
        ...values,
        price: parseFloat(values.price),
        maxUsers: parseInt(values.maxUsers),
        features: values.features.split("\n").filter(f => f.trim()),
      };
      
      await onSave(formattedValues);
      
      toast({
        title: `Plano ${isEditing ? "atualizado" : "criado"} com sucesso!`,
        description: `O plano ${values.name} foi ${isEditing ? "atualizado" : "criado"} com sucesso.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar plano",
        description: "Ocorreu um erro ao salvar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do plano conforme necessário."
              : "Preencha as informações do novo plano."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status do Plano</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? "Plano ativo" : "Plano inativo"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
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
                name="maxUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Usuários</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recursos (um por linha)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Salvar Alterações" : "Criar Plano"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
