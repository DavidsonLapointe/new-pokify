
import { ReactElement } from "react";

// Status da ferramenta
export type ToolStatus = "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";

// Interface para as ferramentas
export interface Tool {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  status: ToolStatus;
  detailedDescription: string;
  price: number;
  credits?: number;
  badgeLabel: string;
  howItWorks: string[];
  benefits: string[];
  executeLabel?: string;
  executeIcon?: React.ElementType;
  actionLabel?: string;
  actionIcon?: React.ElementType;
}

export interface SetupContactInfo {
  name: string;
  phone: string;
}

// Status do setup no ambiente administrativo
export type SetupStatus = "pending" | "in_progress" | "completed";

// Interface para os setups administrativos
export interface ModuleSetup {
  id: string;
  organizationId: string;
  moduleId: string;
  contactName: string;
  contactPhone: string;
  contractedAt: Date;
  status: SetupStatus;
}
