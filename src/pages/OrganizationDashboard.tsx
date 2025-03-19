
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { MonthlyPerformanceChart } from "@/components/sellers/MonthlyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTabContent } from "@/components/dashboard/LeadsTabContent";
import { SellersTabContent } from "@/components/dashboard/SellersTabContent";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PerformanceMetric } from "@/hooks/dashboard/usePerformanceData";
import { User } from "@/types";

const OrganizationDashboard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Só redireciona se não estiver carregando e não tiver usuário
    if (!loading && !user) {
      console.log("No user found, redirecting to auth");
      navigate('/auth');
      return;
    }
  }, [user, loading, navigate]);

  const {
    monthStats,
    dailyLeadsData,
    monthlyLeadsData,
    dailyCallsData,
    monthlyCallsData,
    dailyPerformanceData,
    monthlyPerformanceData,
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
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
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
    sellers
  } = useDashboardData();

  // Create a proper User array from the simplified sellers data
  const formattedSellers: User[] = sellers.map(seller => ({
    id: seller.id,
    name: seller.name,
    email: `${seller.id}@example.com`, // Placeholder email
    role: "seller",
    status: "active",
    createdAt: new Date().toISOString(),
  }));

  // Mostra loading enquanto carrega o usuário
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Se não houver usuário depois do carregamento, não renderiza nada
  if (!user) {
    return null;
  }

  // Define as tabs disponíveis
  const availableTabs = [
    { id: "leads", label: "Leads" },
    { id: "calls", label: "Uploads" },
    { id: "sellers", label: "Performance Vendedores" },
    { id: "sellers-info", label: "Vendedores" }
  ];

  // Mostra todas as tabs em desenvolvimento
  const userTabs = availableTabs;
  const defaultTab = "leads";

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
            sellers={formattedSellers}
          />
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          <CallsStats
            total={monthStats.total}
            processed={monthStats.processed || 0}
            failed={monthStats.failed || 0}
            subtitle="Total acumulado desde o início"
          />
          <div className="grid gap-6">
            <DailyCallsChart 
              data={monthlyCallsData}
              isMonthly={true}
              selectedSeller={monthlyCallsSeller}
              onSellerChange={setMonthlyCallsSeller}
              sellers={formattedSellers}
            />
            <DailyCallsChart 
              data={dailyCallsData}
              selectedDate={callsDate}
              onDateChange={setCallsDate}
              selectedSeller={dailyCallsSeller}
              onSellerChange={setDailyCallsSeller}
              sellers={formattedSellers}
            />
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-6">
          <div className="grid gap-6">
            <DailyPerformanceChart 
              data={dailyPerformanceData}
              selectedMetric={dailyMetric as PerformanceMetric}
              onMetricChange={(metric) => setDailyMetric(metric as any)}
            />
            <MonthlyPerformanceChart 
              data={monthlyPerformanceData}
              selectedMetric={monthlyMetric as PerformanceMetric}
              onMetricChange={(metric) => setMonthlyMetric(metric as any)}
            />
          </div>
        </TabsContent>

        <TabsContent value="sellers-info">
          <SellersTabContent sellers={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
