
import { LucideIcon } from "lucide-react";

export type LeadTemperature = "cold" | "warm" | "hot";

export interface CRMInfo {
  funnel: string;
  stage: string;
  lastUpdate?: string;
}

export interface LeadInfo {
  name?: string;
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
  date: string;
  duration: string;
  status: "success" | "failed";
}

export interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  contactType: "phone" | "email";
  contactValue: string;
  status: "pending" | "contacted";
  createdAt: string;
  callCount: number;
  calls?: Call[];
  crmInfo?: CRMInfo;
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
