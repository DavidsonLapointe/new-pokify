
import { Building2, BrainCircuit } from "lucide-react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { mockAvailableIntegrations, getIntegrationDescription } from "@/constants/integrations";
import { Integration } from "@/types/integration";
import { useState } from "react";
import { IntegrationSection } from "@/components/integrations/IntegrationSection";

const OrganizationIntegrations = () => {
  const [integrations, setIntegrations] = useState<{
    crm?: Integration;
    llm?: Integration;
  }>({});

  const handleSelectIntegration = (type: "crm" | "llm", integrationId: string) => {
    if (!integrationId) return;

    const tool = mockAvailableIntegrations[type].find((t) => t.id === integrationId);
    if (!tool) return;

    const newIntegration: Integration = {
      id: tool.id,
      name: tool.name,
      type,
      description: getIntegrationDescription(tool.id),
      isConnected: false,
    };

    setIntegrations((prev) => ({
      ...prev,
      [type]: newIntegration,
    }));
  };

  const handleToggleIntegration = (integration: Integration) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration.type]: {
        ...integration,
        isConnected: !integration.isConnected,
        lastSync: integration.isConnected ? undefined : new Date().toISOString(),
      },
    }));
  };

  return (
    <OrganizationLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Configure as integrações com outras ferramentas
          </p>
        </div>

        <div className="space-y-8">
          <IntegrationSection
            type="crm"
            title="CRM"
            icon={<Building2 className="w-6 h-6" />}
            availableTools={mockAvailableIntegrations.crm}
            isActive={!!integrations.crm?.isConnected}
            selectedIntegration={integrations.crm}
            onSelect={handleSelectIntegration}
            onToggle={handleToggleIntegration}
          />

          <IntegrationSection
            type="llm"
            title="Modelo LLM"
            icon={<BrainCircuit className="w-6 h-6" />}
            availableTools={mockAvailableIntegrations.llm}
            isActive={!!integrations.llm?.isConnected}
            selectedIntegration={integrations.llm}
            onSelect={handleSelectIntegration}
            onToggle={handleToggleIntegration}
          />
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationIntegrations;
