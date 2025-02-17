
import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { DailyLeadsChart } from "@/components/leads/DailyLeadsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays } from "date-fns";

const OrganizationDashboard = () => {
  const { monthStats } = useCallsPage();

  // Gera dados para os últimos 30 dias (chamadas)
  const dailyCallsData = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(new Date(), 29 - index);
    return {
      day: format(date, 'dd/MM'),
      processadas: Math.floor(Math.random() * 10) + 1,
      pendentes: Math.floor(Math.random() * 5),
      erro: Math.floor(Math.random() * 3),
    };
  });

  // Gera dados para os últimos 30 dias (leads)
  const dailyLeadsData = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(new Date(), 29 - index);
    return {
      day: format(date, 'dd/MM'),
      novos: Math.floor(Math.random() * 5) + 1, // 1-5 novos leads por dia
    };
  });

  // Mock data para estatísticas de leads
  const leadsStats = {
    total: 150,
    active: 45,
    pending: 105,
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua organização
          </p>
        </div>

        <Tabs defaultValue="calls" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calls">Chamadas</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calls" className="space-y-6">
            <CallsStats
              total={monthStats.total}
              processed={monthStats.processed}
              pending={monthStats.pending}
              failed={monthStats.failed}
            />
            <DailyCallsChart data={dailyCallsData} />
          </TabsContent>
          
          <TabsContent value="leads" className="space-y-6">
            <LeadsStats
              total={leadsStats.total}
              active={leadsStats.active}
              pending={leadsStats.pending}
            />
            <DailyLeadsChart data={dailyLeadsData} />
          </TabsContent>
        </Tabs>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
