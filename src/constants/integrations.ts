
export const mockAvailableIntegrations = {
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

export const getIntegrationDescription = (id: string): string => {
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
