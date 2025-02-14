
import { LucideIcon } from "lucide-react";

export interface Call {
  id: number;
  date: string;
  phone: string;
  duration: string;
  status: "processed" | "pending" | "failed";
  seller: string;
  audioUrl: string;
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
