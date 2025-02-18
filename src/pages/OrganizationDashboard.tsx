import OrganizationLayout from "@/components/OrganizationLayout";
import { useCallsPage } from "@/hooks/useCallsPage";
import { CallsStats } from "@/components/calls/CallsStats";
import { DailyCallsChart } from "@/components/dashboard/DailyCallsChart";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { DailyLeadsChart } from "@/components/leads/DailyLeadsChart";
import { MonthlyLeadsChart } from "@/components/leads/MonthlyLeadsChart";
import { SellersStats } from "@/components/sellers/SellersStats";
import { DailyPerformanceChart } from "@/components/sellers/DailyPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfMonth, endOfMonth, isWithinInterval, addDays, subMonths } from "date-fns";
import { useState, useMemo } from "react";

const OrganizationDashboard = () => {
  const { monthStats, filteredLeads } = useCallsPage();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dailyCallsData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    const uploadsByDay = new Map();
    
    filteredLeads.forEach(call => {
      if (!call.emptyLead) {
        const callDate = new Date(call.date);
        
        if (isWithinInterval(callDate, { start: monthStart, end: monthEnd })) {
          const dayKey = format(callDate, 'dd/MM');
          uploadsByDay.set(dayKey, (uploadsByDay.get(dayKey) || 0) + 1);
        }
      }
    });

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

  const dailyLeadsData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const daysInMonth = endOfMonth(selectedDate).getDate();
    
    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        novos: Math.floor(Math.random() * 5) + 1,
      };
    });
  }, [selectedDate]);

  const monthlyLeadsData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy'),
        novos: Math.floor(Math.random() * 50) + 20,
      };
    }).reverse();
  }, []);

  const dailyPerformanceData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const daysInMonth = endOfMonth(selectedDate).getDate();
    
    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        joao: Math.floor(Math.random() * 6) + 2,
        maria: Math.floor(Math.random() * 5) + 1,
      };
    });
  }, [selectedDate]);

  const sellersStats = {
    totalSellers: 8,
    activeSellers: 6,
    topPerformerLeads: 42,
  };

  const leadsStats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const activeLeads = filteredLeads.filter(lead => !lead.emptyLead).length;
    const pendingLeads = totalLeads - activeLeads;

    return {
      total: totalLeads,
      active: activeLeads,
      pending: pendingLeads,
    };
  }, [filteredLeads]);

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
          </TabsList>
          
          <TabsContent value="leads" className="space-y-6">
            <LeadsStats
              total={leadsStats.total}
              active={leadsStats.active}
              pending={leadsStats.pending}
            />
            <div className="space-y-6">
              <MonthlyLeadsChart data={monthlyLeadsData} />
              <DailyLeadsChart 
                data={dailyLeadsData}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <CallsStats
              total={monthStats.total}
              processed={monthStats.processed}
              failed={monthStats.failed}
            />
            <DailyCallsChart 
              data={dailyCallsData}
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
