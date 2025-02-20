
import { User } from "./user-types";
import type { UserStatus, OrganizationPendingReason } from "./user-types";

export interface Organization {
  id: number;
  name: string;
  nomeFantasia: string;
  plan: string;
  users: User[];
  status: UserStatus;
  pendingReason?: OrganizationPendingReason;
  integratedCRM: string | null;
  integratedLLM: string | null;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
  contractSignedAt?: string;
  createdAt: string;
}
