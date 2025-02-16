
import { Plug, AlertCircle, Brain } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Integration } from "@/types/integration";
import { IntegrationSection } from "@/components/integrations/IntegrationSection";
import { mockAvailableIntegrations, getIntegrationDescription } from "@/constants/integrations";

const OrganizationIntegrations = () => {
  const { toast } = useToast();
  
  const [selectedIntegrations, setSelectedIntegrations] = useState<{
    crm?: Integration;
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

  const handleSelectIntegration = (type: "crm" | "llm", integrationId: string) => {
    console.log('Selecting integration:', { type, integrationId });
    
    const hasActiveIntegration = activeIntegrations.some(
      (integration) => integration.type === type
    );

    if (hasActiveIntegration) {
      const activeIntegration = activeIntegrations.find(
        (integration) => integration.type === type
      );
      
      if (activeIntegration?.id !== integrationId) {
        toast({
          variant: "destructive",
          title: "Atenção!",
          description: "Desconecte a integração atual antes de selecionar uma nova.",
          duration: 3000,
        });
        return;
      }
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

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas integrações com CRMs e modelos LLM
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dica</AlertTitle>
          <AlertDescription>
            Configure um CRM e um modelo LLM para começar a usar o sistema automaticamente.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          <IntegrationSection
            type="crm"
            title="CRMs"
            icon={<Plug className="w-5 h-5" />}
            availableTools={mockAvailableIntegrations.crm}
            isActive={activeIntegrations.some((i) => i.type === "crm")}
            selectedIntegration={selectedIntegrations.crm}
            onSelect={handleSelectIntegration}
            onToggle={handleToggleIntegration}
          />

          <IntegrationSection
            type="llm"
            title="Modelos LLM"
            icon={<Brain className="w-5 h-5" />}
            availableTools={mockAvailableIntegrations.llm}
            isActive={activeIntegrations.some((i) => i.type === "llm")}
            selectedIntegration={selectedIntegrations.llm}
            onSelect={handleSelectIntegration}
            onToggle={handleToggleIntegration}
          />
        </div>
      </div>
      <Toaster />
    </OrganizationLayout>
  );
};

export default OrganizationIntegrations;
