
export interface AdminIntegration {
  id: string;
  name: string;
  type: "crm" | "call" | "llm";
  contactType?: "email" | "phone";
  isActive: boolean;
}
