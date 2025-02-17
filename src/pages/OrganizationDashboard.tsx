
import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { DailyLeadsChart } from "@/components/leads/DailyLeadsChart";
import { SellersStats } from "@/components/sellers/SellersStats";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfMonth, endOfMonth, isWithinInterval, addDays } from "date-fns";
import { useState, useMemo } from "react";

const OrganizationDashboard = () => {
  const { monthStats, filteredLeads } = useCallsPage();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Processa os dados de uploads por dia para o mês selecionado
  const dailyCallsData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    // Agrupa os uploads por dia
    const uploadsByDay = new Map();
    
    filteredLeads.forEach(call => {
      if (!call.emptyLead) { // Ignora leads sem uploads
        const callDate = new Date(call.date);
        
        // Verifica se a chamada está dentro do mês selecionado
        if (isWithinInterval(callDate, { start: monthStart, end: monthEnd })) {
          const dayKey = format(callDate, 'dd/MM');
          uploadsByDay.set(dayKey, (uploadsByDay.get(dayKey) || 0) + 1);
        }
      }
    });

    // Converte o Map para o formato esperado pelo gráfico
    const daysInMonth = Array.from({ length: monthEnd.getDate() }, (_, i) => {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
      const dayKey = format(date, 'dd/MM');
      return {
        day: dayKey,
        uploads: uploadsByDay.get(dayKey) || 0
      };
    });

    return daysInMonth;
  }, [selectedDate, filteredLeads]);

  // Gera dados para o mês atual (leads)
  const dailyLeadsData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const daysInMonth = endOfMonth(selectedDate).getDate();
    
    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        novos: Math.floor(Math.random() * 5) + 1, // 1-5 novos leads por dia
      };
    });
  }, [selectedDate]);

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

  // Mock data para performance dos vendedores
  const dailyPerformanceData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const daysInMonth = endOfMonth(selectedDate).getDate();
    
    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        joao: Math.floor(Math.random() * 6) + 2, // 2-7 leads por dia
        maria: Math.floor(Math.random() * 5) + 1, // 1-5 leads por dia
      };
    });
  }, [selectedDate]);

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
