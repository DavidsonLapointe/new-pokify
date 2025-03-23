
import { Call } from "@/types/calls";
import { LeadType } from "./utils";

export interface LeadCalls {
  id: string;
  personType: "pf" | "pj";
  leadType?: LeadType;
  firstName: string;
  lastName?: string;
  razaoSocial?: string;
  calls: Call[];
  crmInfo?: {
    funnel: string;
    stage: string;
  };
  createdAt: string;
  status?: "active" | "inactive";
}

export interface CallsTableProps {
  calls: Call[];
  statusMap: any;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

// Re-export Call type for components that import from here
export type { Call };
