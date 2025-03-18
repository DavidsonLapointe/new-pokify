
type ContactType = "email" | "phone";

interface ToolWithContact {
  id: string;
  name: string;
  contactType?: ContactType;
}

export const mockAvailableIntegrations = {
  crm: [
    { id: "hubspot", name: "HubSpot" },
    { id: "salesforce", name: "Salesforce" },
    { id: "zoho", name: "Zoho CRM" },
  ],
  llm: [
    { id: "gpt4o", name: "GPT-4O" },
    { id: "perplexity", name: "Perplexity AI" },
    { id: "claude", name: "Claude AI" },
  ],
  whatsapp: [
    { id: "whatsappofficial", name: "WhatsApp Oficial" },
    { id: "whatsappbusiness", name: "WhatsApp Business" },
  ],
};

export const getIntegrationDescription = (id: string): string => {
  const descriptions: { [key: string]: string } = {
    hubspot: "Integre suas chamadas diretamente com o HubSpot CRM",
    salesforce: "Sincronize leads automaticamente com o Salesforce",
    zoho: "Conecte-se ao Zoho CRM para gestão completa",
    gpt4o: "Modelo LLM otimizado para extração de dados de chamadas",
    perplexity: "Modelo LLM especializado em análise de contexto",
    claude: "Assistente AI avançado para análise de conversas",
    whatsappofficial: "Integração oficial com a API do WhatsApp",
    whatsappbusiness: "Integração com a plataforma WhatsApp Business",
  };
  return descriptions[id] || "Descrição não disponível";
};

export const getContactType = (toolId: string): ContactType | undefined => {
  return undefined; // Como não temos mais integrações de chamada, esta função sempre retornará undefined
};
