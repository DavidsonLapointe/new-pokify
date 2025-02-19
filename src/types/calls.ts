
import { LucideIcon } from "lucide-react";

export type LeadTemperature = "cold" | "warm" | "hot";

export interface CRMInfo {
  funnel: string;
  stage: string;
  lastUpdate?: string;
}

export interface LeadInfo {
  personType: "pf" | "pj";
  firstName: string;
  lastName?: string;
  razaoSocial?: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  budget?: string;
  interests?: string[];
  painPoints?: string[];
  nextSteps?: string;
}

export interface Lead {
  id: string;
  personType: "pf" | "pj";
  firstName?: string;
  lastName?: string;
  razaoSocial?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  crmInfo?: CRMInfo;
  createdAt: string;
}

export interface LeadCalls extends Lead {
  calls: Call[];
}

export interface CallAnalysis {
  transcription?: string;
  summary: string;
  sentiment: {
    temperature: LeadTemperature;
    reason: string;
  };
  leadInfo?: LeadInfo;
}

export interface Call {
  id: string;
  leadId?: string;
  date: string;
  duration: string;
  status: "success" | "failed";
  phone: string;
  seller?: string;
  audioUrl?: string;
  mediaType: "audio" | "video";
  analysis?: CallAnalysis;
  crmInfo?: CRMInfo;
  leadInfo: {
    name: string;
    email: string;
  };
  emptyLead?: boolean;
  isNewLead?: boolean;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
  tooltip: string;
}

export interface StatusMap {
  [key: string]: StatusConfig;
}

export interface MonthStats {
  total: number;
  processed: number;
  failed: number;
}
