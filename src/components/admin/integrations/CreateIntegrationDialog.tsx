
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["crm", "call", "llm"]),
  contactType: z.enum(["email", "phone"]).optional(),
  requiresContact: z.boolean().default(false),
});

interface CreateIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateIntegrationDialog = ({
  open,
  onOpenChange,
}: CreateIntegrationDialogProps) => {
  const [showContactType, setShowContactType] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requiresContact: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Integração</DialogTitle>
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowContactType(value === "call");
                      if (value !== "call") {
                        form.setValue("requiresContact", false);
                        form.setValue("contactType", undefined);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="call">Ferramenta de Chamada</SelectItem>
                      <SelectItem value="llm">Modelo LLM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showContactType && (
              <>
                <FormField
                  control={form.control}
                  name="requiresContact"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Requer informação de contato
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("requiresContact") && (
                  <FormField
                    control={form.control}
                    name="contactType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Contato</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de contato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Telefone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
