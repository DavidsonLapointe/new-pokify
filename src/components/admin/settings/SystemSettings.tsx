
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  maintenanceWindow: z.string(),
  apiRateLimit: z.coerce.number().min(1),
  resourceUsageLimit: z.coerce.number().min(1).max(100),
});

const SystemSettings = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maintenanceWindow: "01:00-03:00",
      apiRateLimit: 100,
      resourceUsageLimit: 80,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Sistema</CardTitle>
        <CardDescription>
          Defina parâmetros globais do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maintenanceWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Janela de Manutenção (UTC)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="HH:MM-HH:MM" />
                  </FormControl>
                  <FormDescription>
                    Período para manutenção programada (formato: HH:MM-HH:MM).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiRateLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Requisições API (por minuto)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número máximo de requisições API por minuto por empresa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourceUsageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Uso de Recursos (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Percentual máximo de uso de recursos do sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Salvar Alterações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
