
export interface OrganizationUser {
  role: "admin" | "seller";
  status: "active" | "inactive";
}

export interface Organization {
  id: number;
  name: string;
  nomeFantasia: string;
  plan: string;
  users: OrganizationUser[];
  status: "active" | "inactive";
  integratedCRM: string | null;
  integratedLLM: string | null;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
}
