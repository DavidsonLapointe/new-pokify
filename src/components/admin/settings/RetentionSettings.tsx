
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  analysisRetentionDays: z.coerce.number().min(1),
  autoCleanupDays: z.coerce.number().min(1),
  logRetentionDays: z.coerce.number().min(1),
});

const RetentionSettings = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      analysisRetentionDays: 90,
      autoCleanupDays: 30,
      logRetentionDays: 60,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regras de Retenção</CardTitle>
        <CardDescription>
          Defina os períodos de retenção para diferentes tipos de dados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="analysisRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retenção de Análises (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Período de armazenamento das análises realizadas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoCleanupDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limpeza Automática (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Frequência da limpeza automática de dados antigos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retenção de Logs (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Período de retenção dos logs do sistema.
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

export default RetentionSettings;
