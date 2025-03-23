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
  email?: string;
  phone: string;
  company?: string;
  position?: string;
  budget?: string;
  interests?: string[];
  painPoints?: string[];
  nextSteps?: string;
  temperature?: "hot" | "warm" | "cold";
  status?: "active" | "inactive";
}

export interface CallAnalysis {
  transcription?: string;
  summary?: string;
  sentiment: {
    temperature: LeadTemperature;
    reason: string;
  };
  keywords?: string[];
  suggestions?: string[];
  objections?: string[];
  leadInfo?: LeadInfo;
  chatMessages?: any[]; // Added for chat interactions
  report?: any; // Added for report generation
}

export interface Call {
  id: string;
  leadId?: string;
  organizationId?: string;
  userId?: string;
  date?: string;
  duration: string;
  status: "success" | "failed" | "processed";
  phone?: string;
  seller?: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  transcriptionUrl?: string | null;
  mediaType?: "audio" | "video";
  analysis?: CallAnalysis;
  crmInfo?: CRMInfo;
  leadInfo?: LeadInfo;
  emptyLead?: boolean;
  isNewLead?: boolean;
  fileName?: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  transcription?: string;
  summary?: string;
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
  active: number;
  pending: number;
  processed?: number;
  failed?: number;
  novos?: number;
}
