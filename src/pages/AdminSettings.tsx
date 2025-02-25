
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertsLimitsSettings from "@/components/admin/settings/AlertsLimitsSettings";
import RetentionSettings from "@/components/admin/settings/RetentionSettings";
import AnalysisSettings from "@/components/admin/settings/AnalysisSettings";
import SystemSettings from "@/components/admin/settings/SystemSettings";
import LLMSettings from "@/components/admin/settings/llm/LLMSettings";
import { DefaultPermissionsSettings } from "@/components/admin/settings/DefaultPermissionsSettings";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações globais do ambiente administrativo
        </p>
      </div>

      <Alert>
        <AlertDescription>
          Estas configurações afetam todas as empresas contratantes do Leadly.
          Altere com cautela.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Limites e Alertas</TabsTrigger>
          <TabsTrigger value="retention">Regras de Retenção</TabsTrigger>
          <TabsTrigger value="analysis">Parâmetros de Análise</TabsTrigger>
          <TabsTrigger value="llm">LLM</TabsTrigger>
          <TabsTrigger value="system">Configurações de Sistema</TabsTrigger>
          <TabsTrigger value="permissions">Permissões Padrão</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <AlertsLimitsSettings />
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <RetentionSettings />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <AnalysisSettings />
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <LLMSettings />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <DefaultPermissionsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
