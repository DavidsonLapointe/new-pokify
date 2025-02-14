
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
