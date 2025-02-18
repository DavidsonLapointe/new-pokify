import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const formSchema = z.object({
  creditAlertThreshold: z.coerce.number().min(1).max(100),
  maxAlertFrequency: z.coerce.number().min(1),
  maxAnalysisRetries: z.coerce.number().min(1).max(10),
  llmCreditThreshold: z.coerce.number().min(1).max(100),
  llmAlertFrequency: z.coerce.number().min(1),
  llmUsageCheckInterval: z.coerce.number().min(5),
});

const AlertsLimitsSettings = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditAlertThreshold: 20,
      maxAlertFrequency: 24,
      maxAnalysisRetries: 3,
      llmCreditThreshold: 15,
      llmAlertFrequency: 12,
      llmUsageCheckInterval: 30,
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
                  <div className="flex items-center space-x-2">
                    <FormLabel>Threshold de Alerta de Créditos (%)</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Define o percentual mínimo de créditos restantes que, quando atingido, 
                             dispara alertas automáticos para os administradores da empresa contratante. 
                             Por exemplo: 20% significa que o alerta será enviado quando restar apenas 20% dos créditos.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
                  <div className="flex items-center space-x-2">
                    <FormLabel>Frequência Máxima de Alertas (horas)</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Determina o intervalo mínimo entre envios de alertas do mesmo tipo para uma empresa.
                             Evita o spam de notificações definindo um período de espera obrigatório entre alertas
                             similares.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
                  <div className="flex items-center space-x-2">
                    <FormLabel>Tentativas Máximas de Análise</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Define quantas vezes o sistema tentará processar um arquivo em caso de falha.
                             Após atingir este limite, o arquivo será marcado como falha permanente e
                             precisará ser submetido novamente.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Alertas de Uso de LLM</h3>
              
              <FormField
                control={form.control}
                name="llmCreditThreshold"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel>Threshold de Alerta de Créditos LLM (%)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Percentual mínimo de créditos restantes no serviço de LLM da empresa 
                               que, quando atingido, dispara alertas automáticos. Por exemplo: 15% 
                               significa que o alerta será enviado quando restar apenas 15% dos 
                               créditos do modelo LLM.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Porcentagem mínima de créditos LLM para disparar alerta.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="llmAlertFrequency"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel>Frequência de Alertas LLM (horas)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Intervalo mínimo entre envios de alertas relacionados ao saldo 
                               de LLM para uma mesma empresa. Evita o envio excessivo de 
                               notificações sobre o mesmo problema.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Intervalo entre alertas de saldo LLM para a mesma empresa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="llmUsageCheckInterval"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel>Intervalo de Verificação (minutos)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Frequência com que o sistema verifica o saldo de créditos LLM 
                               das empresas. Um intervalo menor permite detecção mais rápida 
                               de problemas, mas pode aumentar o custo de requisições à API 
                               do provedor LLM.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Frequência de verificação do saldo de créditos LLM.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Salvar Alterações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AlertsLimitsSettings;
