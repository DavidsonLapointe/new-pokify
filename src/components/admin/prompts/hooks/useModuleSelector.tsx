
import { useMemo } from "react";
import { useModulesManagement } from "@/components/admin/modules/hooks/useModulesManagement";
import { Plan } from "@/components/admin/plans/plan-form-schema";

interface Module {
  id: string;
  name: string;
  icon: string;
}

/**
 * Custom hook to handle module selection logic
 * @param propModules Optional array of modules to use instead of fetching from system
 * @returns Object containing available modules and loading state
 */
export const useModuleSelector = (propModules?: Module[]) => {
  // Fetch modules from the admin module system
  const { modules, isLoading } = useModulesManagement();
  
  // Combine provided modules with system modules, or use system modules if none provided
  const availableModules = useMemo(() => {
    if (propModules && propModules.length > 0) {
      return propModules;
    }
    
    // Map system modules to the expected format
    return modules.map((module: Plan) => ({
      id: module.id.toString(),
      name: module.name,
      icon: module.icon || "MessageCircle"
    }));
  }, [modules, propModules]);

  return {
    availableModules,
    isLoading
  };
};
