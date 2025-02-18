
import { useCallsPage } from "./useCallsPage";
import { useLeadsData } from "./dashboard/useLeadsData";
import { useCallsData } from "./dashboard/useCallsData";
import { useObjectionsData } from "./dashboard/useObjectionsData";
import { usePerformanceData } from "./dashboard/usePerformanceData";

export const useDashboardData = () => {
  const { monthStats } = useCallsPage();
  const leadsData = useLeadsData();
  const callsData = useCallsData();
  const objectionsData = useObjectionsData();
  const performanceData = usePerformanceData();

  return {
    monthStats,
    ...leadsData,
    ...callsData,
    ...objectionsData,
    ...performanceData,
  };
};
