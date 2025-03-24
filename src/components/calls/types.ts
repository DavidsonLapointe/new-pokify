
import { Call, LeadInfo } from "@/types/calls";

export type LeadType = "client" | "prospect" | "employee" | "candidate" | "supplier" | "partner";

export interface LeadCalls {
  id: string;
  personType: "pf" | "pj";
  firstName: string;
  lastName?: string;
  razaoSocial?: string;
  email?: string;
  phone?: string;
  calls: Call[];
  createdAt: string;
  crmInfo?: {
    funnel: string;
    stage: string;
  };
  status?: "active" | "inactive";
  company?: string;
  contactType?: "phone" | "email";
  contactValue?: string;
  leadType?: LeadType;
}
