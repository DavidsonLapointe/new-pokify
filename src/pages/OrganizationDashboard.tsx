
import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            <DailyCallsChart data={dailyData} />
          </TabsContent>
          
          <TabsContent value="leads">
            <div className="text-center py-8 text-muted-foreground">
              Conteúdo da tab Leads será implementado em breve
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
