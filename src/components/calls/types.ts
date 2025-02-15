
import { Call, StatusMap } from "@/types/calls";

export interface LeadCalls {
  id: string;
  personType: "pf" | "pj";
  firstName?: string;
  lastName?: string;
  razaoSocial?: string;
  calls: Call[];
  crmInfo?: {
    funnel: string;
    stage: string;
  };
  createdAt: string;
}

export interface CallsTableProps {
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}
