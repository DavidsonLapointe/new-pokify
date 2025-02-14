
import { useState, useEffect } from "react";
import { Phone, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";
import { SellerSelector, Seller } from "@/components/dashboard/SellerSelector";

// Dados mockados de vendedores para exemplo
const mockSellers: Seller[] = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "Pedro Oliveira" },
];

const OrganizationDashboard = () => {
  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());
  const [selectedSeller, setSelectedSeller] = useState("all");
  const [stats, setStats] = useState({
    totalCalls: 0,
    processedCalls: 0,
    pendingCalls: 0,
    failedCalls: 0,
  });
  const [dailyData, setDailyData] = useState<any[]>([]);

  const getMonthYearOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      options.push(monthYear);
    }
    
    return options;
  };

  const handleMonthYearChange = (value: string) => {
    setSelectedMonthYear(value);
    generateDailyData(value, selectedSeller);
  };

  const handleSellerChange = (value: string) => {
    setSelectedSeller(value);
    generateDailyData(selectedMonthYear, value);
  };

  const generateDailyData = (monthYear: string, sellerId: string) => {
    const days = [];
    let totalProcessadas = 0;
    let totalPendentes = 0;
    let totalErro = 0;

    // Simulando diferentes volumes de dados por vendedor
    const multiplier = sellerId === "all" ? 1 : 
      sellerId === "1" ? 0.4 : 
      sellerId === "2" ? 0.3 : 
      0.3;

    for (let i = 1; i <= 30; i++) {
      const processadas = Math.floor((Math.random() * 8 + 2) * multiplier);
      const pendentes = Math.floor((Math.random() * 4 + 1) * multiplier);
      const erro = Math.floor((Math.random() * 2) * multiplier);
      
      totalProcessadas += processadas;
      totalPendentes += pendentes;
      totalErro += erro;

      days.push({
        day: i,
        total: processadas + pendentes + erro,
        processadas,
        pendentes,
        erro,
      });
    }

    setDailyData(days);
    setStats({
      totalCalls: totalProcessadas + totalPendentes + totalErro,
      processedCalls: totalProcessadas,
      pendingCalls: totalPendentes,
      failedCalls: totalErro,
    });
  };

  useEffect(() => {
    generateDailyData(selectedMonthYear, selectedSeller);
  }, []);

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe suas métricas de chamadas e leads
            </p>
          </div>

          <div className="flex gap-4">
            <SellerSelector
              selectedSeller={selectedSeller}
              onSellerChange={handleSellerChange}
              sellers={mockSellers}
            />
            <MonthYearSelector
              selectedMonthYear={selectedMonthYear}
              onMonthYearChange={handleMonthYearChange}
              options={getMonthYearOptions()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Chamadas"
            value={stats.totalCalls}
            icon={Phone}
            tooltip="Número total de chamadas recebidas no período, incluindo chamadas processadas, pendentes e com erro"
          />
          <StatCard
            title="Chamadas Processadas"
            value={stats.processedCalls}
            icon={CheckCircle2}
            color="text-green-500"
            tooltip="Chamadas que foram atendidas e processadas com sucesso pelo sistema"
          />
          <StatCard
            title="Chamadas Pendentes"
            value={stats.pendingCalls}
            icon={Clock}
            color="text-yellow-500"
            tooltip="Chamadas que ainda estão aguardando processamento ou intervenção manual"
          />
          <StatCard
            title="Chamadas com Erro"
            value={stats.failedCalls}
            icon={AlertCircle}
            color="text-red-500"
            tooltip="Chamadas que falharam durante o processamento e precisam ser verificadas"
          />
        </div>

        <DailyCallsChart data={dailyData} />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
