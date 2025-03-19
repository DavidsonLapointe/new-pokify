
import { Call, LeadInfo } from "./calls";

export interface Lead {
  id: string;
  organizationId?: string;
  firstName: string;
  lastName?: string;
  status: "pending" | "contacted" | "failed" | "qualified" | "negotiation";
  temperature?: "cold" | "warm" | "hot";
  personType?: "pf" | "pj";
  contactType?: "phone" | "email";
  contactValue?: string;
  email?: string;
  phone?: string;
  company?: string;
  razaoSocial?: string;
  cnpj?: string;
  cpf?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt?: string;
  callCount?: number;
  calls?: {
    id: string;
    date: string;
    duration: string;
    status: "success" | "failed" | "processed";
    fileName?: string;
  }[];
  crmId?: string;
  crmLink?: string;
  source?: string;
  notes?: {
    id: string;
    content: string;
    createdAt: string;
    createdBy: {
      id: string;
      name: string;
    };
  }[];
  crmInfo?: {
    funnel: string;
    stage: string;
  };
}

export interface LeadWithCalls {
  id: string;
  leadInfo: LeadInfo;
  calls: Call[];
  createdAt: string;
  crmInfo?: {
    funnel: string;
    stage: string;
  };
}
