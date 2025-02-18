
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  maxFileSize: z.coerce.number().min(1),
  processingTimeout: z.coerce.number().min(30),
  maxSimultaneousAnalysis: z.coerce.number().min(1),
});

const AnalysisSettings = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxFileSize: 50,
      processingTimeout: 300,
      maxSimultaneousAnalysis: 5,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parâmetros de Análise</CardTitle>
        <CardDescription>
          Configure os limites e parâmetros para análise de arquivos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maxFileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho Máximo de Arquivo (MB)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tamanho máximo permitido para upload de arquivos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processingTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout de Processamento (segundos)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tempo máximo para processamento de uma análise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSimultaneousAnalysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Análises Simultâneas por Empresa</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número máximo de análises simultâneas por empresa.
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

export default AnalysisSettings;
