
import { Users, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface LeadsStatsProps {
  total: number;
  active: number;
  pending: number;
}

export const LeadsStats = ({ total, active, pending }: LeadsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total de Leads (Geral)"
        subtitle="Total acumulado"
        value={total}
        icon={Users}
        tooltip="Número total de leads cadastrados no sistema desde o início"
      />
      <StatCard
        title="Leads Ativos (Geral)"
        subtitle="Total acumulado"
        value={active}
        icon={CheckCircle2}
        color="text-green-500"
        tooltip="Total de leads que possuem pelo menos um arquivo de áudio ou vídeo processado desde o início"
      />
      <StatCard
        title="Leads Pendentes (Geral)"
        subtitle="Total acumulado"
        value={pending}
        icon={Clock}
        color="text-yellow-500"
        tooltip="Total de leads que ainda não possuem nenhum arquivo de áudio ou vídeo processado desde o início"
      />
    </div>
  );
};
