
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { CreditAlertThresholdField } from "./alerts-limits/CreditAlertThresholdField";
import { MaxAlertFrequencyField } from "./alerts-limits/MaxAlertFrequencyField";
import { MaxAnalysisRetriesField } from "./alerts-limits/MaxAnalysisRetriesField";
import { useAlertsLimitsForm } from "./alerts-limits/useAlertsLimitsForm";
import { AlertsLimitsFormValues, EnabledSettings } from "./alerts-limits/types";

const AlertsLimitsSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [enabledSettings, setEnabledSettings] = useState<EnabledSettings>({
    creditAlertThreshold: true,
    maxAlertFrequency: true,
    maxAnalysisRetries: true,
  });

  const form = useAlertsLimitsForm();

  const onSubmit = (values: AlertsLimitsFormValues) => {
    const enabledValues = Object.keys(values).reduce((acc, key) => {
      if (enabledSettings[key as keyof typeof enabledSettings]) {
        acc[key] = values[key as keyof typeof values];
      }
      return acc;
    }, {} as Partial<AlertsLimitsFormValues>);

    console.log(enabledValues);
    toast.success("Configurações salvas com sucesso!");
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
            <CreditAlertThresholdField 
              form={form} 
              isEditing={isEditing} 
              enabledSettings={enabledSettings} 
              onToggle={toggleSetting} 
            />

            <MaxAlertFrequencyField 
              form={form} 
              isEditing={isEditing} 
              enabledSettings={enabledSettings} 
              onToggle={toggleSetting} 
            />

            <MaxAnalysisRetriesField 
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

export default AlertsLimitsSettings;
