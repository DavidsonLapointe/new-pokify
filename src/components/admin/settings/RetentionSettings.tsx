
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
  audioRetentionDays: z.coerce.number().min(1),
  analysisRetentionDays: z.coerce.number().min(1),
  transcriptionRetentionDays: z.coerce.number().min(1),
});

const RetentionSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [enabledSettings, setEnabledSettings] = useState({
    audioRetentionDays: true,
    analysisRetentionDays: true,
    transcriptionRetentionDays: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioRetentionDays: 30,
      analysisRetentionDays: 90,
      transcriptionRetentionDays: 60,
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
    toast.success("Configurações de retenção salvas com sucesso!");
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
          Regras de Retenção
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Configure os períodos de retenção para diferentes tipos de dados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="audioRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Retenção de Áudios (dias)</FormLabel>
                    <CustomSwitch
                      checked={enabledSettings.audioRetentionDays}
                      onCheckedChange={() => toggleSetting('audioRetentionDays')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.audioRetentionDays}
                      className={(!isEditing || !enabledSettings.audioRetentionDays) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Período de retenção para arquivos de áudio originais.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="analysisRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Retenção de Análises (dias)</FormLabel>
                    <CustomSwitch
                      checked={enabledSettings.analysisRetentionDays}
                      onCheckedChange={() => toggleSetting('analysisRetentionDays')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.analysisRetentionDays}
                      className={(!isEditing || !enabledSettings.analysisRetentionDays) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Período de retenção para análises geradas pelo sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transcriptionRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Retenção de Transcrições (dias)</FormLabel>
                    <CustomSwitch
                      checked={enabledSettings.transcriptionRetentionDays}
                      onCheckedChange={() => toggleSetting('transcriptionRetentionDays')}
                    />
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing || !enabledSettings.transcriptionRetentionDays}
                      className={(!isEditing || !enabledSettings.transcriptionRetentionDays) ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Período de retenção para transcrições de áudio.
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

export default RetentionSettings;
