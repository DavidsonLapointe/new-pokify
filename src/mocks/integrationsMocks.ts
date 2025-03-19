
import { Integration } from "@/types/integration";
import { v4 as uuidv4 } from "uuid";

// Mock data for central integrations (managed by Leadly)
export const mockCentralIntegrations: Integration[] = [
  {
    id: uuidv4(),
    name: "HubSpot",
    type: "crm",
    isConnected: true,
    apiKey: "mock-hubspot-api-key",
    apiEndpoint: "https://api.hubspot.com/v3",
    description: "Integração com HubSpot CRM",
    iconUrl: "/images/hubspot-logo.png"
  },
  {
    id: uuidv4(),
    name: "Salesforce",
    type: "crm",
    isConnected: true,
    apiKey: "mock-salesforce-api-key",
    apiEndpoint: "https://api.salesforce.com/v1",
    description: "Integração com Salesforce CRM",
    iconUrl: "/images/salesforce-logo.png"
  },
  {
    id: uuidv4(),
    name: "OpenAI",
    type: "llm",
    isConnected: true,
    apiKey: "mock-openai-api-key",
    apiEndpoint: "https://api.openai.com/v1",
    description: "Integração com OpenAI (GPT)",
    iconUrl: "/images/openai-logo.png"
  }
];

// Mock data for client integrations (managed by organizations)
export const mockIntegrations: Integration[] = [
  {
    id: uuidv4(),
    name: "Zoho CRM",
    type: "crm",
    isConnected: false,
    apiKey: "",
    apiEndpoint: "https://api.zoho.com/crm/v3",
    description: "Integração com Zoho CRM",
    iconUrl: "/images/zoho-logo.png"
  },
  {
    id: uuidv4(),
    name: "WhatsApp Business",
    type: "whatsapp",
    isConnected: true,
    apiKey: "mock-whatsapp-api-key",
    apiEndpoint: "https://api.whatsapp.com/business/v1",
    description: "Integração com WhatsApp Business API",
    iconUrl: "/images/whatsapp-logo.png"
  }
];
