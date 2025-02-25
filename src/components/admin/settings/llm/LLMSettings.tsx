
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { LLMCreditThresholdField } from "./LLMCreditThresholdField";
import { LLMAlertFrequencyField } from "./LLMAlertFrequencyField";
import { LLMUsageCheckIntervalField } from "./LLMUsageCheckIntervalField";
import { useLLMForm } from "./useLLMForm";
import { EnabledSettings, LLMFormValues } from "./types";

const LLMSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [enabledSettings, setEnabledSettings] = useState<EnabledSettings>({
    llmCreditThreshold: true,
    llmAlertFrequency: true,
    llmUsageCheckInterval: true,
  });

  const form = useLLMForm();

  const onSubmit = (values: LLMFormValues) => {
    const enabledValues = Object.keys(values).reduce((acc, key) => {
      if (enabledSettings[key as keyof typeof enabledSettings]) {
        acc[key] = values[key as keyof typeof values];
      }
      return acc;
    }, {} as Partial<LLMFormValues>);

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
            <LLMCreditThresholdField 
              form={form} 
              isEditing={isEditing} 
              enabledSettings={enabledSettings} 
              onToggle={toggleSetting} 
            />

            <LLMAlertFrequencyField 
              form={form} 
              isEditing={isEditing} 
              enabledSettings={enabledSettings} 
              onToggle={toggleSetting} 
            />

            <LLMUsageCheckIntervalField 
              form={form} 
              isEditing={isEditing} 
              enabledSettings={enabledSettings} 
              onToggle={toggleSetting} 
            />

            <Button 
              type="button"
              onClick={isEditing ? form.handleSubmit(onSubmit) : handleEditClick}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isEditing ? "Salvar Alterações" : "Editar Informações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LLMSettings;
