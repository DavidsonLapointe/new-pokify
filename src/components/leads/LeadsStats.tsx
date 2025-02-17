
import { Users, PhoneCall, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface LeadsStatsProps {
  total: number;
  active: number;
  contacted: number;
  lost: number;
}

export const LeadsStats = ({ total, active, contacted, lost }: LeadsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        tooltip="Leads que estão em processo de negociação"
      />
      <StatCard
        title="Leads Contatados"
        value={contacted}
        icon={PhoneCall}
        color="text-yellow-500"
        tooltip="Leads que já receberam ao menos um contato"
      />
      <StatCard
        title="Leads Perdidos"
        value={lost}
        icon={AlertCircle}
        color="text-red-500"
        tooltip="Leads que não avançaram no processo"
      />
    </div>
  );
};
