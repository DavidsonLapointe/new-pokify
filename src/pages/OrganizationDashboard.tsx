
import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { format, subDays } from "date-fns";

const OrganizationDashboard = () => {
  const { monthStats } = useCallsPage();

  // Gera dados para os últimos 30 dias
  const dailyData = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(new Date(), 29 - index);
    return {
      day: format(date, 'dd/MM'),
      processadas: Math.floor(Math.random() * 10) + 1, // 1-10 chamadas processadas
      pendentes: Math.floor(Math.random() * 5),        // 0-4 chamadas pendentes
      erro: Math.floor(Math.random() * 3),            // 0-2 chamadas com erro
    };
  });

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

        <DailyCallsChart data={dailyData} />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
