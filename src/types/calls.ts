import { LucideIcon } from "lucide-react";

export type LeadTemperature = "cold" | "warm" | "hot";

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
  id: number;
  date: string;
  phone: string;
  duration: string;
  status: "processed" | "pending" | "failed";
  seller: string;
  audioUrl: string;
  analysis?: CallAnalysis;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
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
