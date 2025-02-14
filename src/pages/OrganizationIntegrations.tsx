
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Link, Plug, AlertCircle, Brain } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useState } from "react";

// Mock das integrações disponíveis
const mockIntegrations = [
  {
    id: "hubspot",
    name: "HubSpot",
    type: "crm",
    description: "Integre suas chamadas diretamente com o HubSpot CRM",
    isConnected: true,
    lastSync: "2024-02-20T10:30:00",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    type: "crm",
    description: "Sincronize leads automaticamente com o Salesforce",
    isConnected: false,
  },
  {
    id: "zendesk",
    name: "Zendesk Talk",
    type: "call",
    description: "Capture chamadas realizadas através do Zendesk Talk",
    isConnected: true,
    lastSync: "2024-02-20T11:45:00",
  },
  {
    id: "aircall",
    name: "Aircall",
    type: "call",
    description: "Integração com sistema de chamadas Aircall",
    isConnected: false,
  },
  {
    id: "gpt4o",
    name: "GPT-4O",
    type: "llm",
    description: "Modelo LLM otimizado para extração de dados de chamadas",
    isConnected: true,
    lastSync: "2024-02-20T12:00:00",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    type: "llm",
    description: "Modelo LLM especializado em análise de contexto",
    isConnected: false,
  },
];

const OrganizationIntegrations = () => {
  const [integrations] = useState(mockIntegrations);

  const handleToggleIntegration = (integrationId: string) => {
    // Aqui será implementada a lógica de conexão/desconexão
    console.log(`Toggle integration: ${integrationId}`);
  };

  const IntegrationCard = ({ integration }: { integration: any }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{integration.name}</h3>
          <p className="text-sm text-muted-foreground">
            {integration.description}
          </p>
          {integration.isConnected && integration.lastSync && (
            <p className="text-xs text-muted-foreground">
              Última sincronização: {new Date(integration.lastSync).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
        <Button
          variant={integration.isConnected ? "destructive" : "default"}
          onClick={() => handleToggleIntegration(integration.id)}
        >
          {integration.isConnected ? "Desconectar" : "Conectar"}
        </Button>
      </div>
    </Card>
  );

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas integrações com CRMs, ferramentas de chamada e modelos LLM
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dica</AlertTitle>
          <AlertDescription>
            Configure pelo menos um CRM, uma ferramenta de chamada e um modelo LLM para
            começar a usar o sistema automaticamente.
          </AlertDescription>
        </Alert>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Plug className="w-5 h-5" />
            <h2 className="text-xl font-semibold">CRMs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations
              .filter((integration) => integration.type === "crm")
              .map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Ferramentas de Chamada</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations
              .filter((integration) => integration.type === "call")
              .map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Modelos LLM</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations
              .filter((integration) => integration.type === "llm")
              .map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationIntegrations;
