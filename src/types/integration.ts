
export interface Integration {
  id: string;
  name: string;
  type: "crm" | "call" | "llm" | "whatsapp";
  description: string;
  isConnected: boolean;
  lastSync?: string;
  apiKey?: string;
  contactValue?: string;
}
