
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";
import { 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  UserPlus, 
  Zap
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AdminBillingChart } from "@/components/admin/dashboard/AdminBillingChart";
import { AdminNewCustomersChart } from "@/components/admin/dashboard/AdminNewCustomersChart";
import { AdminAIExecutionsChart } from "@/components/admin/dashboard/AdminAIExecutionsChart";
import { AdminDailyBillingChart } from "@/components/admin/dashboard/AdminDailyBillingChart";

const AdminDashboard = () => {
  const [selectedAIFunction, setSelectedAIFunction] = useState("all");
  const [activeTab, setActiveTab] = useState("billing");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Get dashboard data from a centralized hook
  const { isLoading, data } = useDashboardData();
  
  // Reset selectedAIFunction when changing tabs
  useEffect(() => {
    if (activeTab === "ai-executions") {
      setSelectedAIFunction("all");
    }
  }, [activeTab]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral da plataforma Leadly
        </p>
      </div>

      {/* Key metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Empresas Ativas"
          value={data?.activeOrganizations || 0}
          icon={Users}
          color="text-green-500"
          tooltip="Total de empresas com status ativo na plataforma"
        />
        
        <StatCard
          title="Setups Pendentes/Em Andamento"
          value={data?.pendingSetups || 0}
          icon={Clock}
          color="text-amber-500"
          tooltip="Empresas com configuração inicial pendente ou em andamento"
        />
        
        <StatCard
          title="Empresas Sem Acesso (>5 dias)"
          value={data?.inactiveUsers || 0}
          icon={Calendar}
          color="text-red-500"
          tooltip="Empresas onde nenhum usuário fez login nos últimos 5 dias"
        />
      </div>

      {/* Dashboard tabs */}
      <Tabs 
        defaultValue="billing" 
        className="space-y-4"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList>
          <TabsTrigger value="billing">Faturamento Mensal</TabsTrigger>
          <TabsTrigger value="daily-billing">Faturamento Diário</TabsTrigger>
          <TabsTrigger value="customers">Novos Clientes</TabsTrigger>
          <TabsTrigger value="ai-executions">Execuções de IA</TabsTrigger>
        </TabsList>
        
        {/* Faturamento Mensal */}
        <TabsContent value="billing" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Faturamento Mensal</h2>
          </div>
          
          <AdminBillingChart 
            data={data?.monthlyBilling || []} 
            isLoading={isLoading}
          />
        </TabsContent>
        
        {/* Faturamento Diário */}
        <TabsContent value="daily-billing" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Faturamento Diário</h2>
            <MonthYearSelector 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate}
              billingData={data?.dailyBilling}
            />
          </div>
          
          <AdminDailyBillingChart 
            data={data?.dailyBilling || []} 
            selectedDate={selectedDate}
            isLoading={isLoading}
          />
        </TabsContent>
        
        {/* Novos Clientes */}
        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Novos Clientes por Mês</h2>
          </div>
          
          <AdminNewCustomersChart 
            data={data?.newCustomers || []} 
            isLoading={isLoading}
          />
        </TabsContent>
        
        {/* Execuções de IA */}
        <TabsContent value="ai-executions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Execuções de IA por Mês</h2>
            <div className="flex gap-4">
              <Select
                value={selectedAIFunction}
                onValueChange={setSelectedAIFunction}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Função de IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  <SelectItem value="analysis">Análise de Chamadas</SelectItem>
                  <SelectItem value="transcription">Transcrição</SelectItem>
                  <SelectItem value="scoring">Pontuação de Leads</SelectItem>
                  <SelectItem value="suggestions">Sugestões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <AdminAIExecutionsChart 
            data={data?.aiExecutions || []} 
            selectedFunction={selectedAIFunction}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
