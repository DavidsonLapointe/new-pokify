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
