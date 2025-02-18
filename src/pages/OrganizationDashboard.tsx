
import OrganizationLayout from "@/components/OrganizationLayout";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { SellersStats } from "@/components/sellers/SellersStats";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTabContent } from "@/components/dashboard/LeadsTabContent";
import { ObjectionsTabContent } from "@/components/dashboard/ObjectionsTabContent";
import { SellersTabContent } from "@/components/dashboard/SellersTabContent";
import { useDashboardData } from "@/hooks/useDashboardData";
import { mockUsers } from "@/types/organization";

const OrganizationDashboard = () => {
  const {
    monthStats,
    dailyLeadsData,
    monthlyLeadsData,
    dailyCallsData,
    monthlyCallsData,
    dailyPerformanceData,
    objectionsData,
    objectionTrendsData,
    objectionExamples,
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    callsDate,
    setCallsDate,
    performanceDate,
    monthlyCallsSeller,
    setMonthlyCallsSeller,
    dailyCallsSeller,
    setDailyCallsSeller,
    monthlyLeadsSeller,
    setMonthlyLeadsSeller,
    dailyLeadsSeller,
    setDailyLeadsSeller,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller,
  } = useDashboardData();

  const leadsStats = {
    total: monthStats.total,
    active: monthStats.processed,
    pending: monthStats.pending,
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

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="calls">Uploads</TabsTrigger>
            <TabsTrigger value="sellers">Performance</TabsTrigger>
            <TabsTrigger value="objections">Objeções</TabsTrigger>
            <TabsTrigger value="sellers-info">Vendedores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsTabContent
              leadsStats={leadsStats}
              monthlyLeadsData={monthlyLeadsData}
              dailyLeadsData={dailyLeadsData}
              monthlyLeadsDate={monthlyLeadsDate}
              setMonthlyLeadsDate={setMonthlyLeadsDate}
              dailyLeadsDate={dailyLeadsDate}
              setDailyLeadsDate={setDailyLeadsDate}
              monthlyLeadsSeller={monthlyLeadsSeller}
              setMonthlyLeadsSeller={setMonthlyLeadsSeller}
              dailyLeadsSeller={dailyLeadsSeller}
              setDailyLeadsSeller={setDailyLeadsSeller}
              sellers={mockUsers}
            />
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <CallsStats
              total={monthStats.total}
              processed={monthStats.processed}
              failed={monthStats.failed}
              subtitle="Total acumulado desde o início"
            />
            <div className="grid gap-6">
              <DailyCallsChart 
                data={monthlyCallsData}
                isMonthly={true}
                selectedSeller={monthlyCallsSeller}
                onSellerChange={setMonthlyCallsSeller}
                sellers={mockUsers}
              />
              <DailyCallsChart 
                data={dailyCallsData}
                selectedDate={callsDate}
                onDateChange={setCallsDate}
                selectedSeller={dailyCallsSeller}
                onSellerChange={setDailyCallsSeller}
                sellers={mockUsers}
              />
            </div>
          </TabsContent>

          <TabsContent value="sellers" className="space-y-6">
            <SellersStats
              totalSellers={8}
              activeSellers={6}
              topPerformerLeads={42}
            />
            <DailyPerformanceChart 
              data={dailyPerformanceData}
            />
          </TabsContent>

          <TabsContent value="objections" className="space-y-6">
            <ObjectionsTabContent
              objectionsData={objectionsData}
              objectionTrendsData={objectionTrendsData}
              objectionExamples={objectionExamples}
              monthlyObjectionsDate={monthlyObjectionsDate}
              setMonthlyObjectionsDate={setMonthlyObjectionsDate}
              monthlyObjectionsSeller={monthlyObjectionsSeller}
              setMonthlyObjectionsSeller={setMonthlyObjectionsSeller}
              objectionTrendsSeller={objectionTrendsSeller}
              setObjectionTrendsSeller={setObjectionTrendsSeller}
              sellers={mockUsers}
            />
          </TabsContent>

          <TabsContent value="sellers-info">
            <SellersTabContent sellers={mockUsers} />
          </TabsContent>
        </Tabs>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
