
export interface Integration {
  id: string;
  name: string;
  type: "crm" | "call" | "llm";
  description: string;
  isConnected: boolean;
  lastSync?: string;
}
