import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { DailyLeadsChart } from "@/components/leads/DailyLeadsChart";
import { SellersStats } from "@/components/sellers/SellersStats";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useState, useMemo } from "react";

const OrganizationDashboard = () => {
  const { monthStats } = useCallsPage();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Gera dados para o mês selecionado (chamadas)
  const dailyCallsData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    return Array.from({ length: 30 }).map((_, index) => {
      const date = subDays(monthEnd, 29 - index);
      if (isWithinInterval(date, { start: monthStart, end: monthEnd })) {
        return {
          day: format(date, 'dd/MM'),
          processadas: Math.floor(Math.random() * 10) + 1,
          pendentes: Math.floor(Math.random() * 5),
          erro: Math.floor(Math.random() * 3),
        };
      }
      return null;
    }).filter(Boolean);
  }, [selectedDate]);

  // Gera dados para os últimos 30 dias (leads)
  const dailyLeadsData = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(startOfMonth(selectedDate), -index);
    return {
      day: format(date, 'dd/MM'),
      novos: Math.floor(Math.random() * 5) + 1, // 1-5 novos leads por dia
    };
  });

  // Calcula as estatísticas de leads para o mês selecionado
  const leadsStats = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    // Filtra apenas os leads do mês selecionado
    const monthLeads = dailyLeadsData.filter(lead => {
      const [day, month] = lead.day.split('/').map(Number);
      const leadDate = new Date(selectedDate.getFullYear(), month - 1, day);
      return isWithinInterval(leadDate, { start: monthStart, end: monthEnd });
    });

    // Calcula o total de leads no mês
    const total = monthLeads.reduce((acc, curr) => acc + curr.novos, 0);
    
    // Simula leads ativos e pendentes baseado no total
    const active = Math.floor(total * 0.3); // 30% dos leads são ativos
    const pending = total - active; // restante são pendentes

    return {
      total,
      active,
      pending,
    };
  }, [selectedDate, dailyLeadsData]);

  // Gera dados para performance dos vendedores
  const dailyPerformanceData = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(new Date(), 29 - index);
    return {
      day: format(date, 'dd/MM'),
      joao: Math.floor(Math.random() * 6) + 2, // 2-7 leads por dia
      maria: Math.floor(Math.random() * 5) + 1, // 1-5 leads por dia
    };
  });

  // Mock data para estatísticas de vendedores
  const sellersStats = {
    totalSellers: 8,
    activeSellers: 6,
    topPerformerLeads: 42,
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
            <TabsTrigger value="sellers">Performance Vendedores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calls" className="space-y-6">
            <CallsStats
              total={monthStats.total}
              processed={monthStats.processed}
              pending={monthStats.pending}
              failed={monthStats.failed}
            />
            <DailyCallsChart 
              data={dailyCallsData}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>
          
          <TabsContent value="leads" className="space-y-6">
            <LeadsStats
              total={leadsStats.total}
              active={leadsStats.active}
              pending={leadsStats.pending}
            />
            <DailyLeadsChart 
              data={dailyLeadsData}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="sellers" className="space-y-6">
            <SellersStats
              totalSellers={sellersStats.totalSellers}
              activeSellers={sellersStats.activeSellers}
              topPerformerLeads={sellersStats.topPerformerLeads}
            />
            <DailyPerformanceChart data={dailyPerformanceData} />
          </TabsContent>
        </Tabs>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
