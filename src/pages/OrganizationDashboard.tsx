
import OrganizationLayout from "@/components/OrganizationLayout";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { MonthlyPerformanceChart } from "@/components/sellers/MonthlyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTabContent } from "@/components/dashboard/LeadsTabContent";
import { ObjectionsTabContent } from "@/components/dashboard/ObjectionsTabContent";
import { SellersTabContent } from "@/components/dashboard/SellersTabContent";
import { useDashboardData } from "@/hooks/useDashboardData";
import { mockUsers } from "@/types/organization";
import { mockCalls } from "@/mocks/calls";
import { LeadsPageContent } from "@/components/leads/LeadsPageContent";

const OrganizationDashboard = () => {
  const {
    monthStats,
    dailyLeadsData,
    monthlyLeadsData,
    dailyCallsData,
    monthlyCallsData,
    dailyPerformanceData,
    monthlyPerformanceData,
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
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
  } = useDashboardData();

  const statusMap = {
    success: {
      label: "Sucesso",
      color: "text-green-500",
      icon: null,
      tooltip: "Chamada processada com sucesso"
    },
    failed: {
      label: "Falha",
      color: "text-red-500",
      icon: null,
      tooltip: "Falha no processamento"
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    console.log("Playing audio:", audioUrl);
  };

  const handleViewAnalysis = (call: any) => {
    console.log("Viewing analysis for call:", call);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

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
            <TabsTrigger value="sellers">Performance Vendedores</TabsTrigger>
            <TabsTrigger value="objections">Objeções</TabsTrigger>
            <TabsTrigger value="sellers-info">Vendedores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsPageContent
              searchQuery=""
              onSearchChange={() => {}}
              monthStats={monthStats}
              calls={mockCalls}
              statusMap={statusMap}
              onPlayAudio={handlePlayAudio}
              onViewAnalysis={handleViewAnalysis}
              formatDate={formatDate}
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
            <div className="grid gap-6">
              <DailyPerformanceChart 
                data={dailyPerformanceData}
                selectedMetric={dailyMetric}
                onMetricChange={setDailyMetric}
              />
              <MonthlyPerformanceChart 
                data={monthlyPerformanceData}
                selectedMetric={monthlyMetric}
                onMetricChange={setMonthlyMetric}
              />
            </div>
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
