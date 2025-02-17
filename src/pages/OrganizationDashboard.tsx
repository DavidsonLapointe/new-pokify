
import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";

const OrganizationDashboard = () => {
  const { monthStats } = useCallsPage();

  // Dados mockados para o gráfico diário
  const dailyData = [
    { day: '01/03', processadas: 5, pendentes: 2, erro: 1 },
    { day: '02/03', processadas: 7, pendentes: 3, erro: 0 },
    { day: '03/03', processadas: 4, pendentes: 1, erro: 1 },
    { day: '04/03', processadas: 6, pendentes: 2, erro: 0 },
    { day: '05/03', processadas: 8, pendentes: 1, erro: 1 },
    { day: '06/03', processadas: 3, pendentes: 1, erro: 0 },
    { day: '07/03', processadas: 5, pendentes: 2, erro: 0 },
  ];

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
