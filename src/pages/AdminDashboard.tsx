
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
  Zap,
  ExternalLink
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AdminBillingChart } from "@/components/admin/dashboard/AdminBillingChart";
import { AdminNewCustomersChart } from "@/components/admin/dashboard/AdminNewCustomersChart";
import { AdminAIExecutionsChart } from "@/components/admin/dashboard/AdminAIExecutionsChart";
import { AdminDailyBillingChart } from "@/components/admin/dashboard/AdminDailyBillingChart";
import { InactiveOrgsModal } from "@/components/admin/dashboard/InactiveOrgsModal";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [selectedAIFunction, setSelectedAIFunction] = useState("all");
  const [activeTab, setActiveTab] = useState("billing");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isInactiveOrgsModalOpen, setIsInactiveOrgsModalOpen] = useState(false);
  
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
        
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">Empresas Sem Acesso (>5 dias)</p>
                <h3 className="text-xl font-semibold">{data?.inactiveUsers || 0}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600 flex items-center gap-1"
              onClick={() => setIsInactiveOrgsModalOpen(true)}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ver empresas</span>
            </Button>
          </div>
        </Card>
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

      {/* Inactive Organizations Modal */}
      <InactiveOrgsModal 
        isOpen={isInactiveOrgsModalOpen}
        onOpenChange={setIsInactiveOrgsModalOpen}
        inactiveOrgs={data?.inactiveOrganizations || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminDashboard;
