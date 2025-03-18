
export type ModuleStatus = "active" | "inactive" | "pending";
export type ToolStatus = "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  price: number;
  status: ModuleStatus;
  image: string;
  terms: string;
}

export type SetupStatus = "pending" | "in_progress" | "completed";

export interface SetupNote {
  id?: string;
  content: string;
  createdAt: Date;
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

export interface SetupContactInfo {
  name: string;
  phone: string;
}

export interface ModuleSetup {
  id: string;
  organizationId: string;
  organizationName?: string;
  moduleId: string;
  moduleName?: string;
  contactName: string;
  contactPhone: string;
  contractedAt: Date;
  status: SetupStatus;
  notes: SetupNote[];
  activities?: {
    total: number;
    completed: number;
  };
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  setupPrice?: number;
  termPrice?: number;
  termLink?: string;
  cancelationDescription?: string;
  setupDescription?: string;
  setupContactInfo?: SetupContactInfo;
  
  // Properties that were causing errors
  icon?: any;
  status?: ToolStatus;
  badgeLabel?: string;
  detailedDescription?: string;
  credits?: number;
  howItWorks?: string[];
  benefits?: string[];
  executeIcon?: any;
  executeLabel?: string;
}

// Interface for the module (without circular reference)
export interface Module {
  id: string;
  name: string;
  description: string;
}
