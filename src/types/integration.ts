
export interface Integration {
  id: string;
  name: string;
  type: "crm" | "call" | "llm" | "whatsapp";
  description: string;
  isConnected?: boolean;
  isActive?: boolean;
  lastSync?: string;
  apiKey?: string;
  apiEndpoint?: string;
  iconUrl?: string;
  contactValue?: string;
}
