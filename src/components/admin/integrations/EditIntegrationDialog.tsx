
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AdminIntegration } from "@/types/admin";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["crm", "llm", "whatsapp", "call"]),
  isActive: z.boolean(),
});

interface EditIntegrationDialogProps {
  integration: AdminIntegration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateIntegration: (updatedIntegration: AdminIntegration) => void;
}

export const EditIntegrationDialog = ({
  integration,
  open,
  onOpenChange,
  onUpdateIntegration,
}: EditIntegrationDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: integration.name,
      type: integration.type,
      isActive: integration.isActive,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Combine form values with the integration ID to create the updated integration
    const updatedIntegration: AdminIntegration = {
      ...integration,
      ...values,
    };
    
    // Call the callback with the updated integration
    onUpdateIntegration(updatedIntegration);
    
    // Show success message and close dialog
    toast.success("Integração atualizada com sucesso!");
    form.reset();
    onOpenChange(false);
  };

  const watchIsActive = form.watch("isActive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Integração</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Ferramenta</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="llm">Modelo LLM</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="call">Chamada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-row items-center space-x-2">
                    <FormLabel className="m-0">Status</FormLabel>
                    <Badge
                      className={`${
                        watchIsActive
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      {watchIsActive ? "Ativo" : "Inativo"}
                    </Badge>
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

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="cancel"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
