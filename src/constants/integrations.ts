
export const mockAvailableIntegrations = {
  crm: [
    { id: "hubspot", name: "HubSpot" },
    { id: "salesforce", name: "Salesforce" },
    { id: "zoho", name: "Zoho CRM" },
  ],
  call: [
    { id: "zendesk", name: "Zendesk Talk", contactType: "email" },
    { id: "aircall", name: "Aircall", contactType: "phone" },
    { id: "twilio", name: "Twilio", contactType: "phone" },
  ],
  llm: [
    { id: "gpt4o", name: "GPT-4O" },
    { id: "perplexity", name: "Perplexity AI" },
    { id: "claude", name: "Claude AI" },
  ],
};

export const getIntegrationDescription = (id: string): string => {
  const descriptions: { [key: string]: string } = {
    hubspot: "Integre suas chamadas diretamente com o HubSpot CRM",
    salesforce: "Sincronize leads automaticamente com o Salesforce",
    zoho: "Conecte-se ao Zoho CRM para gestão completa",
    zendesk: "Capture chamadas realizadas através do Zendesk Talk (necessário email)",
    aircall: "Integração com sistema de chamadas Aircall (necessário telefone)",
    twilio: "Sistema de telefonia cloud com Twilio (necessário telefone)",
    gpt4o: "Modelo LLM otimizado para extração de dados de chamadas",
    perplexity: "Modelo LLM especializado em análise de contexto",
    claude: "Assistente AI avançado para análise de conversas",
  };
  return descriptions[id] || "Descrição não disponível";
};

export const getContactType = (toolId: string): "email" | "phone" | undefined => {
  const tool = mockAvailableIntegrations.call.find(tool => tool.id === toolId);
  return tool?.contactType;
};
