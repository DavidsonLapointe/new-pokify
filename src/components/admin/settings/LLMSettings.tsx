
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
import { CustomSwitch } from "@/components/ui/custom-switch";

const formSchema = z.object({
  llmCreditThreshold: z.coerce.number().min(1).max(100),
  llmAlertFrequency: z.coerce.number().min(1),
  llmUsageCheckInterval: z.coerce.number().min(5),
});

const LLMSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [enabledSettings, setEnabledSettings] = useState({
    llmCreditThreshold: true,
    llmAlertFrequency: true,
    llmUsageCheckInterval: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      llmCreditThreshold: 15,
      llmAlertFrequency: 12,
      llmUsageCheckInterval: 30,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const enabledValues = Object.keys(values).reduce((acc, key) => {
      if (enabledSettings[key as keyof typeof enabledSettings]) {
        acc[key] = values[key as keyof typeof values];
      }
      return acc;
    }, {} as Partial<z.infer<typeof formSchema>>);

    console.log(enabledValues);
    toast.success("Configurações de LLM salvas com sucesso!");
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const toggleSetting = (setting: keyof typeof enabledSettings) => {
    setEnabledSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Configurações de LLM
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Configure os parâmetros de monitoramento e alertas para uso de LLM.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="llmCreditThreshold"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
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
                    <CustomSwitch
                      checked={enabledSettings.llmCreditThreshold}
                      onCheckedChange={() => toggleSetting('llmCreditThreshold')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.llmCreditThreshold}
                      className={(!isEditing || !enabledSettings.llmCreditThreshold) ? "bg-muted" : ""} 
                    />
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
                  <div className="flex items-center justify-between">
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
                    <CustomSwitch
                      checked={enabledSettings.llmAlertFrequency}
                      onCheckedChange={() => toggleSetting('llmAlertFrequency')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.llmAlertFrequency}
                      className={(!isEditing || !enabledSettings.llmAlertFrequency) ? "bg-muted" : ""} 
                    />
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
                  <div className="flex items-center justify-between">
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
                    <CustomSwitch
                      checked={enabledSettings.llmUsageCheckInterval}
                      onCheckedChange={() => toggleSetting('llmUsageCheckInterval')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.llmUsageCheckInterval}
                      className={(!isEditing || !enabledSettings.llmUsageCheckInterval) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Frequência de verificação do saldo de créditos LLM.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="button"
              onClick={isEditing ? form.handleSubmit(onSubmit) : handleEditClick}
              className="bg-black text-white hover:bg-black"
            >