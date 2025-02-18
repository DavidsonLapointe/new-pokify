
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  creditAlertThreshold: z.coerce.number().min(1).max(100),
  maxAlertFrequency: z.coerce.number().min(1),
  maxAnalysisRetries: z.coerce.number().min(1).max(10),
});

const AlertsLimitsSettings = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditAlertThreshold: 20,
      maxAlertFrequency: 24,
      maxAnalysisRetries: 3,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limites e Alertas</CardTitle>
        <CardDescription>
          Configure os parâmetros para alertas e limites do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="creditAlertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold de Alerta de Créditos (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Porcentagem mínima de créditos restantes para disparar alerta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAlertFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência Máxima de Alertas (horas)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Intervalo mínimo entre alertas para a mesma empresa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAnalysisRetries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tentativas Máximas de Análise</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número máximo de tentativas para análise de um arquivo.
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

export default AlertsLimitsSettings;
