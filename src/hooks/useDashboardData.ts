
import { useCallsPage } from "./useCallsPage";
import { useLeadsData } from "./dashboard/useLeadsData";
import { useCallsData } from "./dashboard/useCallsData";
import { useObjectionsData } from "./dashboard/useObjectionsData";
import { usePerformanceData } from "./dashboard/usePerformanceData";
import { useSuggestionsData } from "./dashboard/useSuggestionsData";

export const useDashboardData = () => {
  const { monthStats: callsMonthStats } = useCallsPage();
  const leadsData = useLeadsData();
  const callsData = useCallsData();
  const objectionsData = useObjectionsData();
  const performanceData = usePerformanceData();
  const suggestionsData = useSuggestionsData();

  // Transform monthStats to include active property
  const monthStats = {
    total: callsMonthStats.total,
    active: callsMonthStats.processed || 0, // Use processed as active
    pending: callsMonthStats.pending,
    processed: callsMonthStats.processed,
    failed: callsMonthStats.failed,
  };

  return {
    monthStats,
    ...leadsData,
    ...callsData,
    ...objectionsData,
    ...performanceData,
    ...suggestionsData,
  };
};
