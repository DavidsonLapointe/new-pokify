
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
