
import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";

const OrganizationDashboard = () => {
  const { monthStats } = useCallsPage();

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua organização
          </p>
        </div>

        <CallsStats
          total={monthStats.total}
          processed={monthStats.processed}
          pending={monthStats.pending}
          failed={monthStats.failed}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
