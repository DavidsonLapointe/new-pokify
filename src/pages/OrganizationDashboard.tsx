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
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { ObjectionsStats } from "@/components/objections/ObjectionsStats";
import { MonthlyObjectionsChart } from "@/components/objections/MonthlyObjectionsChart";
import { ObjectionsFilters } from "@/components/objections/ObjectionsFilters";
import { ObjectionDetails } from "@/components/objections/ObjectionDetails";
import { ObjectionTrendsChart } from "@/components/objections/ObjectionTrendsChart";

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

  const monthlyCallsData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy'),
        uploads: Math.floor(Math.random() * 50) + 20,
      };
    }).reverse();
  }, []);

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

  const objectionsData = useMemo(() => {
    return [
      { name: "Preço muito alto", count: 28 },
      { name: "Não tenho orçamento no momento", count: 24 },
      { name: "Preciso consultar outras pessoas", count: 20 },
      { name: "Já uso outro produto similar", count: 18 },
      { name: "Não é prioridade agora", count: 15 },
      { name: "Não entendi o valor agregado", count: 12 },
      { name: "Preciso de mais tempo para avaliar", count: 10 },
    ].sort((a, b) => b.count - a.count);
  }, []);

  const objectionsStats = useMemo(() => {
    return {
      totalObjections: 127,
      uniqueObjections: 7,
      mostFrequent: 28,
    };
  }, []);

  const objectionTrendsData = useMemo(() => {
    const lastSixMonths = Array.from({ length: 6 }).map((_, index) => {
      const date = subMonths(new Date(), index);
      return {
        month: format(date, 'MMM/yy'),
        "Preço muito alto": Math.floor(Math.random() * 30) + 10,
        "Não tenho orçamento": Math.floor(Math.random() * 25) + 8,
        "Preciso consultar": Math.floor(Math.random() * 20) + 5,
        "Já uso outro produto": Math.floor(Math.random() * 18) + 5,
        "Não é prioridade": Math.floor(Math.random() * 15) + 5,
      };
    }).reverse();
    return lastSixMonths;
  }, []);

  const objectionExamples = useMemo(() => ({
    "Preço muito alto": [
      "O valor está acima do nosso orçamento atual",
      "Encontramos soluções mais baratas no mercado",
      "Precisamos de um desconto maior para aprovar"
    ],
    "Não tenho orçamento no momento": [
      "Nosso orçamento já foi definido para este ano",
      "Precisamos esperar o próximo trimestre",
      "Estamos com restrições orçamentárias"
    ],
  }), []);

  const MonthlyCallsChart = ({ data }: { data: any[] }) => (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Uploads por mês</h3>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-30}
                textAnchor="end"
                height={40}
                interval={0}
                tick={{ fontSize: 13 }}
              />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="uploads" name="Uploads" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-4">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Uploads: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
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
              subtitle="Total acumulado desde o início"
            />
            <div className="space-y-6">
              <MonthlyCallsChart data={monthlyCallsData} />
              <DailyCallsChart 
                data={dailyCallsData}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sellers" className="space-y-6">
            <SellersStats
              totalSellers={sellersStats.totalSellers}
              activeSellers={sellersStats.activeSellers}
              topPerformerLeads={sellersStats.topPerformerLeads}
            />
            <DailyPerformanceChart data={dailyPerformanceData} />
          </TabsContent>

          <TabsContent value="objections" className="space-y-6">
            <ObjectionsFilters
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <ObjectionsStats
              totalObjections={objectionsStats.totalObjections}
              uniqueObjections={objectionsStats.uniqueObjections}
              mostFrequent={objectionsStats.mostFrequent}
            />
            <div className="grid grid-cols-1 gap-6">
              <MonthlyObjectionsChart data={objectionsData} />
              <ObjectionTrendsChart data={objectionTrendsData} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ObjectionDetails
                  objection="Preço muito alto"
                  count={28}
                  previousCount={22}
                  examples={objectionExamples["Preço muito alto"]}
                />
                <ObjectionDetails
                  objection="Não tenho orçamento no momento"
                  count={24}
                  previousCount={28}
                  examples={objectionExamples["Não tenho orçamento no momento"]}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
