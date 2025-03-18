
export type SetupStatus = "pending" | "in_progress" | "completed";

export type SetupNote = {
  content: string;
  createdAt: Date;
};

export interface ModuleSetup {
  id: string;
  organizationId: string;
  moduleId: string;
  contactName: string;
  contactPhone: string;
  contractedAt: Date;
  status: SetupStatus;
  notes?: SetupNote[];
}

// Adding the missing types that are causing errors

export type ToolStatus = "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";

export interface SetupContactInfo {
  name: string;
  phone: string;
}

export interface Tool {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  status: ToolStatus;
  detailedDescription: string;
  price: number;
  credits?: number;
  badgeLabel: string;
  howItWorks: string[];
  benefits: string[];
  executeIcon?: React.ComponentType<any>;
  executeLabel?: string;
}

