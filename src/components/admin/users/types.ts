
import { User, UserRole } from "@/types";

export interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "dashboard",
    "dashboard.leads",
    "dashboard.uploads",
    "dashboard.performance",
    "dashboard.objections",
    "dashboard.suggestions",
    "dashboard.sellers",
    "leads",
    "users",
    "integrations",
    "settings",
    "plan",
    "company",
    "profile"
  ],
  seller: [
    "dashboard.leads",
    "dashboard.performance",
    "leads",
    "profile"
  ],
  leadly_employee: [
    "dashboard",
    "integrations",
    "plans",
    "organizations",
    "settings",
    "prompt",
    "analysis-packages",
    "financial",
    "users",
    "profile"
  ],
  manager: [
    "dashboard",
    "dashboard.leads",
    "dashboard.performance",
    "dashboard.sellers",
    "leads",
    "users",
    "profile"
  ],
  leadly_master: [
    "dashboard",
    "organizations",
    "users",
    "modules",
    "plans",
    "credit-packages",
    "financial",
    "integrations",
    "prompt",
    "settings",
    "profile",
    "analysis-packages"
  ]
};
