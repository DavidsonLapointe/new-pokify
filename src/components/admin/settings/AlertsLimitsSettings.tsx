
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Lock } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  creditAlertThreshold: z.coerce.number().min(1).max(100),
  maxAlertFrequency: z.coerce.number().min(1),
  maxAnalysisRetries: z.coerce.number().min(1).max(10),
});

const AlertsLimitsSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Limites e Alertas
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
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
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
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
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
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
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Número máximo de tentativas para análise de um arquivo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="button"
              onClick={isEditing ? form.handleSubmit(onSubmit) : handleEditClick}
              variant={isEditing ? "default" : "secondary"}
              className="hover:bg-secondary/80 transition-colors"
            >
              {isEditing ? "Salvar Alterações" : "Editar Informações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AlertsLimitsSettings;
