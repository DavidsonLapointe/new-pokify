
export interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  contactType: "phone" | "email";
  contactValue: string;
  status: "pending" | "contacted" | "failed";
  createdAt: string;
  callCount: number;
  calls?: {
    id: string;
    date: string;
    duration: string;
    status: "success" | "failed";
  }[];
  crmInfo?: {
    funnel: string;
    stage: string;
  };
}

export interface LeadWithCalls {
  id: string;
  leadInfo: {
    personType: "pf" | "pj";
    firstName: string;
    lastName?: string;
    razaoSocial?: string;
    email?: string;
    phone: string;
  };
  calls: any[];
}
