import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Link, Plug, AlertCircle, Brain } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Mock das integrações disponíveis (virá do backend depois)
const mockAvailableIntegrations = {
  crm: [
    { id: "hubspot", name: "HubSpot" },
    { id: "salesforce", name: "Salesforce" },
    { id: "zoho", name: "Zoho CRM" },
  ],
  call: [
    { id: "zendesk", name: "Zendesk Talk" },
    { id: "aircall", name: "Aircall" },
    { id: "twilio", name: "Twilio" },
  ],
  llm: [
    { id: "gpt4o", name: "GPT-4O" },
    { id: "perplexity", name: "Perplexity AI" },
    { id: "claude", name: "Claude AI" },
  ],
};

interface Integration {
  id: string;
  name: string;
  type: "crm" | "call" | "llm";
  description: string;
  isConnected: boolean;
  lastSync?: string;
}

const OrganizationIntegrations = () => {
  const { toast } = useToast();
  
  // Iniciando com o HubSpot já integrado
  const [selectedIntegrations, setSelectedIntegrations] = useState<{
    crm?: Integration;
    call?: Integration;
    llm?: Integration;
  }>({
    crm: {
      id: "hubspot",
      name: "HubSpot",
      type: "crm",
      description: "Integre suas chamadas diretamente com o HubSpot CRM",
      isConnected: true,
      lastSync: new Date().toISOString(),
    }
  });

  // Iniciando com o HubSpot como integração ativa
  const [activeIntegrations, setActiveIntegrations] = useState<Integration[]>([
    {
      id: "hubspot",
      name: "HubSpot",
      type: "crm",
      description: "Integre suas chamadas diretamente com o HubSpot CRM",
      isConnected: true,
      lastSync: new Date().toISOString(),
    }
  ]);

  const getIntegrationDescription = (id: string): string => {
    const descriptions: { [key: string]: string } = {
      hubspot: "Integre suas chamadas diretamente com o HubSpot CRM",
      salesforce: "Sincronize leads automaticamente com o Salesforce",
      zoho: "Conecte-se ao Zoho CRM para gestão completa",
      zendesk: "Capture chamadas realizadas através do Zendesk Talk",
      aircall: "Integração com sistema de chamadas Aircall",
      twilio: "Sistema de telefonia cloud com Twilio",
      gpt4o: "Modelo LLM otimizado para extração de dados de chamadas",
      perplexity: "Modelo LLM especializado em análise de contexto",
      claude: "Assistente AI avançado para análise de conversas",
    };
    return descriptions[id] || "Descrição não disponível";
  };

  const handleSelectIntegration = (type: "crm" | "call" | "llm", integrationId: string) => {
    console.log('Selecting integration:', { type, integrationId });
    
    const hasActiveIntegration = activeIntegrations.some(
      (integration) => integration.type === type
    );

    console.log('Has active integration:', hasActiveIntegration);

    if (hasActiveIntegration) {
      const activeIntegration = activeIntegrations.find(
        (integration) => integration.type === type
      );
      
      console.log('Active integration:', activeIntegration);
      console.log('Attempting to select:', integrationId);

      if (activeIntegration?.id !== integrationId) {
        console.log('Showing toast - different integration selected');
        toast({
          variant: "destructive",
          title: "Atenção!",
          description: "Desconecte a integração atual antes de selecionar uma nova.",
          duration: 3000,
        });
        return;
      }
      console.log('Same integration selected, ignoring');
      return;
    }

    const selectedTool = mockAvailableIntegrations[type].find(
      (tool) => tool.id === integrationId
    );

    if (selectedTool) {
      const newIntegration: Integration = {
        id: selectedTool.id,
        name: selectedTool.name,
        type: type,
        description: getIntegrationDescription(selectedTool.id),
        isConnected: false,
      };

      setSelectedIntegrations((prev) => ({
        ...prev,
        [type]: newIntegration,
      }));
    }
  };

  const handleToggleIntegration = (integration: Integration) => {
    if (integration.isConnected) {
      setActiveIntegrations((prev) =>
        prev.filter((item) => item.id !== integration.id)
      );
      setSelectedIntegrations((prev) => ({
        ...prev,
        [integration.type]: { ...integration, isConnected: false },
      }));

      toast({
        title: "Integração desconectada",
        description: `A integração com ${integration.name} foi desconectada com sucesso.`,
      });
    } else {
      const now = new Date().toISOString();
      const updatedIntegration = {
        ...integration,
        isConnected: true,
        lastSync: now,
      };
      setActiveIntegrations((prev) => [...prev, updatedIntegration]);
      setSelectedIntegrations((prev) => ({
        ...prev,
        [integration.type]: updatedIntegration,
      }));

      toast({
        title: "Integração conectada",
        description: `A integração com ${integration.name} foi estabelecida com sucesso.`,
      });
    }
  };

  const getStatusBadge = (type: "crm" | "call" | "llm") => {
    const isActive = activeIntegrations.some((integration) => integration.type === type);
    
    return (
      <Badge
        variant={isActive ? "default" : "destructive"}
        className={`ml-2 ${isActive ? "bg-green-500 hover:bg-green-600" : ""}`}
      >
        {isActive ? "Ativo" : "Pendente"}
      </Badge>
    );
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => (
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
          onClick={() => handleToggleIntegration(integration)}
        >
          {integration.isConnected ? "Desconectar" : "Conectar"}
        </Button>
      </div>
    </Card>
  );

  const renderSection = (
    type: "crm" | "call" | "llm",
    title: string,
    icon: React.ReactNode,
    availableTools: { id: string; name: string }[]
  ) => (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
          {getStatusBadge(type)}
        </div>
        <Select
          value={selectedIntegrations[type]?.id || ""}
          onValueChange={(value) => handleSelectIntegration(type, value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar ferramenta" />
          </SelectTrigger>
          <SelectContent>
            {availableTools.map((tool) => (
              <SelectItem key={tool.id} value={tool.id}>
                {tool.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedIntegrations[type] && (
        <div className="mt-4">
          <IntegrationCard integration={selectedIntegrations[type]!} />
        </div>
      )}
    </div>
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

        <div className="space-y-8">
          {renderSection(
            "crm",
            "CRMs",
            <Plug className="w-5 h-5" />,
            mockAvailableIntegrations.crm
          )}

          {renderSection(
            "call",
            "Ferramentas de Chamada",
            <Link className="w-5 h-5" />,
            mockAvailableIntegrations.call
          )}

          {renderSection(
            "llm",
            "Modelos LLM",
            <Brain className="w-5 h-5" />,
            mockAvailableIntegrations.llm
          )}
        </div>
      </div>
      <Toaster />
    </OrganizationLayout>
  );
};

export default OrganizationIntegrations;
