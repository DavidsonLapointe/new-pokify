
import { LucideIcon } from "lucide-react";

export type LeadTemperature = "cold" | "warm" | "hot";

export interface CRMInfo {
  funnel: string;
  stage: string;
  lastUpdate?: string;
}

export interface LeadInfo {
  personType: "pf" | "pj";
  firstName?: string;
  lastName?: string;
  razaoSocial?: string;
  email?: string;
  phone: string;
  company?: string;
  position?: string;
  budget?: string;
  interests?: string[];
  painPoints?: string[];
  nextSteps?: string;
}

export interface CallAnalysis {
  transcription: string;
  summary: string;
  sentiment: {
    temperature: LeadTemperature;
    reason: string;
  };
  leadInfo: LeadInfo;
}

export interface Call {
  id: string;
  leadId: string;
  date: string;
  duration: string;
  status: "success" | "failed" | "pending";
  phone: string;
  seller: string;
  audioUrl: string;
  mediaType: "audio" | "video";
  analysis?: CallAnalysis;
  crmInfo?: CRMInfo;
  leadInfo: LeadInfo;
  emptyLead?: boolean; // Adicionada esta propriedade
  isNewLead?: boolean; // Adicionada esta propriedade também para consistência
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
  pending: number;
  failed: number;
}
