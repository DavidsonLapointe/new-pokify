
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

const OrganizationDashboard = () => {
  // Obtém o mês atual como padrão
  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());
  const [stats, setStats] = useState({
    totalCalls: 156,
    processedCalls: 142,
    pendingCalls: 14,
    failedCalls: 3,
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{title}</p>
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
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </div>
        <h3 className="text-2xl font-semibold">{value}</h3>
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
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
