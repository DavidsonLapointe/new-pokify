
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useState } from "react";
import { CustomSwitch } from "@/components/ui/custom-switch";

const formSchema = z.object({
  minConfidenceScore: z.coerce.number().min(0).max(100),
  maxProcessingTime: z.coerce.number().min(1),
  batchSize: z.coerce.number().min(1).max(100),
});

const AnalysisSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [enabledSettings, setEnabledSettings] = useState({
    minConfidenceScore: true,
    maxProcessingTime: true,
    batchSize: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minConfidenceScore: 80,
      maxProcessingTime: 300,
      batchSize: 10,
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
    toast.success("Configurações de análise salvas com sucesso!");
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
          Parâmetros de Análise
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Configure os parâmetros utilizados na análise de áudios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="minConfidenceScore"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Score Mínimo de Confiança (%)</FormLabel>
                    <CustomSwitch
                      checked={enabledSettings.minConfidenceScore}
                      onCheckedChange={() => toggleSetting('minConfidenceScore')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.minConfidenceScore}
                      className={(!isEditing || !enabledSettings.minConfidenceScore) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Score mínimo de confiança para aceitar uma análise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxProcessingTime"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Tempo Máximo de Processamento (segundos)</FormLabel>
                    <CustomSwitch
                      checked={enabledSettings.maxProcessingTime}
                      onCheckedChange={() => toggleSetting('maxProcessingTime')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.maxProcessingTime}
                      className={(!isEditing || !enabledSettings.maxProcessingTime) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tempo máximo permitido para processamento de um áudio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Tamanho do Lote</FormLabel>
                    <CustomSwitch
                      checked={enabledSettings.batchSize}
                      onCheckedChange={() => toggleSetting('batchSize')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.batchSize}
                      className={(!isEditing || !enabledSettings.batchSize) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Quantidade de áudios processados simultaneamente.
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
              {isEditing ? "Salvar Alterações" : "Editar Informações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnalysisSettings;
