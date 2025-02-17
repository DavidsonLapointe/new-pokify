
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
        title="Total de Leads"
        value={total}
        icon={Users}
        tooltip="Número total de leads cadastrados no sistema"
      />
      <StatCard
        title="Leads Ativos"
        value={active}
        icon={CheckCircle2}
        color="text-green-500"
        tooltip="Leads que possuem pelo menos um arquivo de áudio ou vídeo processado"
      />
      <StatCard
        title="Leads Pendentes"
        value={pending}
        icon={Clock}
        color="text-yellow-500"
        tooltip="Leads que ainda não possuem nenhum arquivo de áudio ou vídeo processado"
      />
    </div>
  );
};
