
export interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  contactType: "phone" | "email";
  contactValue: string;
  status: "pending" | "contacted" | "failed";
  createdAt: string;
}
