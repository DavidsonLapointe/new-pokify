import { useState } from "react";
import { Card } from "@/components/ui/card";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Phone, CheckCircle2, Clock, AlertCircle, Calendar, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OrganizationDashboard = () => {
  // Obtém o mês atual como padrão
  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());
  const [stats, setStats] = useState({
    totalCalls: 0,
    processedCalls: 0,
    pendingCalls: 0,
    failedCalls: 0,
  });

  // Gera lista de meses/anos para o dropdown (12 meses anteriores)
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
    // Aqui você pode adicionar a lógica para buscar os dados do mês selecionado
    console.log(`Buscando dados para ${value}`);
  };

  // Dados simulados para o gráfico (30 dias)
  const getDailyData = () => {
    const days = [];
    let totalProcessadas = 0;
    let totalPendentes = 0;
    let totalErro = 0;

    for (let i = 1; i <= 30; i++) {
      const processadas = Math.floor(Math.random() * 8) + 2; // 2-9
      const pendentes = Math.floor(Math.random() * 4) + 1;   // 1-4
      const erro = Math.floor(Math.random() * 2);            // 0-1
      
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

    // Atualiza os stats com os totais calculados
    setStats({
      totalCalls: totalProcessadas + totalPendentes + totalErro,
      processedCalls: totalProcessadas,
      pendingCalls: totalPendentes,
      failedCalls: totalErro,
    });

    return days;
  };

  const [dailyData] = useState(getDailyData());

  const CustomLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text 
        x={x + 30} 
        y={y - 10} 
        fill="#374151" 
        textAnchor="middle"
        fontSize="12"
        fontWeight="500"
      >
        {value}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2">Dia {label}</p>
          <p className="text-sm mb-2 text-gray-700">
            Total: {payload[0].payload.total}
          </p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "text-muted-foreground",
    tooltip,
  }: {
    title: string;
    value: number;
    icon: any;
    color?: string;
    tooltip: string;
  }) => (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

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

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedMonthYear} onValueChange={handleMonthYearChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getMonthYearOptions().map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Distribuição Diária de Chamadas</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="processadas" name="Processadas" stackId="a" fill="#22c55e" />
                  <Bar dataKey="pendentes" name="Pendentes" stackId="a" fill="#eab308" />
                  <Bar dataKey="erro" name="Erro" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
