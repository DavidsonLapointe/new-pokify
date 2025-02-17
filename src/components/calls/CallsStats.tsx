
import { Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface CallsStatsProps {
  total: number;
  processed: number;
  failed: number;
}

export const CallsStats = ({ total, processed, failed }: CallsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total de Chamadas"
        value={total}
        icon={Phone}
        tooltip="Número total de chamadas recebidas no período"
      />
      <StatCard
        title="Chamadas Processadas"
        value={processed}
        icon={CheckCircle2}
        color="text-green-500"
        tooltip="Chamadas que foram processadas com sucesso pelo sistema"
      />
      <StatCard
        title="Chamadas com Erro"
        value={failed}
        icon={AlertCircle}
        color="text-red-500"
        tooltip="Chamadas que falharam durante o processamento e precisam ser reprocessadas"
      />
    </div>
  );
};
