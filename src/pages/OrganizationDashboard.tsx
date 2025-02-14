
import { useState } from "react";
import { Card } from "@/components/ui/card";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Phone, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const OrganizationDashboard = () => {
  const [stats] = useState({
    totalCalls: 156,
    processedCalls: 142,
    pendingCalls: 14,
    failedCalls: 3,
  });

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "text-muted-foreground",
  }: {
    title: string;
    value: number;
    icon: any;
    color?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </Card>
  );

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe suas métricas de chamadas e leads
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Chamadas"
            value={stats.totalCalls}
            icon={Phone}
          />
          <StatCard
            title="Chamadas Processadas"
            value={stats.processedCalls}
            icon={CheckCircle2}
            color="text-green-500"
          />
          <StatCard
            title="Chamadas Pendentes"
            value={stats.pendingCalls}
            icon={Clock}
            color="text-yellow-500"
          />
          <StatCard
            title="Chamadas com Erro"
            value={stats.failedCalls}
            icon={AlertCircle}
            color="text-red-500"
          />
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
