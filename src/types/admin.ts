
export interface AdminIntegration {
  id: string;
  name: string;
  type: "crm" | "call" | "llm" | "whatsapp";
  contactType?: "email" | "phone";
  isActive: boolean;
}
