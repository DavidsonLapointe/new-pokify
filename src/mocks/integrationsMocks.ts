
import { Integration } from "@/types/integration";

export const mockCentralIntegrations: Integration[] = [
  {
    id: "central-1",
    name: "Salesforce",
    type: "crm",
    description: "Integração central com Salesforce",
    isConnected: true,
    apiKey: "sf_api_key_12345",
    lastSync: "2023-10-15T14:30:00Z"
  },
  {
    id: "central-2",
    name: "HubSpot", 
    type: "crm",
    description: "Integração central com HubSpot",
    isConnected: true,
    apiKey: "hs_api_key_67890",
    lastSync: "2023-10-10T09:15:00Z"
  },
  {
    id: "central-3",
    name: "Zendesk",
    type: "crm",
    description: "Integração central com Zendesk",
    isConnected: false,
    apiKey: undefined
  }
];

export const mockClientIntegrations: Integration[] = [
  {
    id: "client-1",
    name: "Google Calendar",
    type: "call",
    description: "Integração de agenda",
    isConnected: true,
    lastSync: "2023-10-20T11:45:00Z"
  },
  {
    id: "client-2",
    name: "Microsoft Teams",
    type: "call",
    description: "Integração de chamadas",
    isConnected: true,
    lastSync: "2023-10-18T16:30:00Z"
  }
];
