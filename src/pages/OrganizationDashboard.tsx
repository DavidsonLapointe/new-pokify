
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { MonthlyPerformanceChart } from "@/components/sellers/MonthlyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTabContent } from "@/components/dashboard/LeadsTabContent";
import { ObjectionsTabContent } from "@/components/dashboard/ObjectionsTabContent";
import { SellersTabContent } from "@/components/dashboard/SellersTabContent";
import { SuggestionsTabContent } from "@/components/dashboard/SuggestionsTabContent";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUser } from "@/contexts/UserContext";

const OrganizationDashboard = () => {
  const { user } = useUser();
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
    suggestionsData,
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
  } = useDashboardData();

  // Define as tabs disponíveis e suas permissões necessárias
  const availableTabs = [
    { id: "leads", label: "Leads", permission: "dashboard.leads" },
    { id: "calls", label: "Uploads", permission: "dashboard.uploads" },
    { id: "sellers", label: "Performance Vendedores", permission: "dashboard.performance" },
    { id: "objections", label: "Objeções", permission: "dashboard.objections" },
    { id: "suggestions", label: "Sugestões", permission: "dashboard.suggestions" },
    { id: "sellers-info", label: "Vendedores", permission: "dashboard.sellers" }
  ];

  // Filtra as tabs baseado nas permissões do usuário
  const userTabs = availableTabs.filter(tab => 
    user.permissions.includes(tab.permission)
  );

  // Define a primeira tab disponível como padrão
  const defaultTab = userTabs[0]?.id || "leads";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua organização
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          {userTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {user.permissions.includes("dashboard.leads") && (
          <TabsContent value="leads">
            <LeadsTabContent
              monthStats={monthStats}
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
              sellers={[]} // TODO: Implementar integração com a API
            />
          </TabsContent>
        )}

        {user.permissions.includes("dashboard.uploads") && (
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
                sellers={[]} // TODO: Implementar integração com a API
              />
              <DailyCallsChart 
                data={dailyCallsData}
                selectedDate={callsDate}
                onDateChange={setCallsDate}
                selectedSeller={dailyCallsSeller}
                onSellerChange={setDailyCallsSeller}
                sellers={[]} // TODO: Implementar integração com a API
              />
            </div>
          </TabsContent>
        )}

        {user.permissions.includes("dashboard.performance") && (
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
        )}

        {user.permissions.includes("dashboard.objections") && (
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
              sellers={[]} // TODO: Implementar integração com a API
            />
          </TabsContent>
        )}

        {user.permissions.includes("dashboard.suggestions") && (
          <TabsContent value="suggestions" className="space-y-6">
            <SuggestionsTabContent
              suggestions={suggestionsData}
              monthlySuggestionsDate={monthlySuggestionsDate}
              setMonthlySuggestionsDate={setMonthlySuggestionsDate}
              monthlySuggestionsSeller={monthlySuggestionsSeller}
              setMonthlySuggestionsSeller={setMonthlySuggestionsSeller}
              sellers={[]} // TODO: Implementar integração com a API
            />
          </TabsContent>
        )}

        {user.permissions.includes("dashboard.sellers") && (
          <TabsContent value="sellers-info">
            <SellersTabContent sellers={[]} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
