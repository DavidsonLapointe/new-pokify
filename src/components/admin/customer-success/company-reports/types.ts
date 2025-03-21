
export type ReportType = "ai-executions" | "ai-tools" | "unused-permissions";

export interface CompanyData {
  name: string;
  activeUsers: number;
  interactions: number;
  modules: {
    count: number;
    names: string[];
  };
  lastActivity: string;
  unusedPermissions?: {
    count: number;
    tabs: string[];
    functions: string[];
  };
}
