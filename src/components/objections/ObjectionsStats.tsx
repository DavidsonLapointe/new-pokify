
import { AlertCircle, MessageSquare, LineChart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface ObjectionsStatsProps {
  totalObjections: number;
  uniqueObjections: number;
  mostFrequent: number;
}

export const ObjectionsStats = ({ totalObjections, uniqueObjections, mostFrequent }: ObjectionsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total de Objeções"
        value={totalObjections}
        icon={MessageSquare}
        tooltip="Número total de objeções detectadas no período"
      />
      <StatCard
        title="Objeções Únicas"
        value={uniqueObjections}
        icon={AlertCircle}
        color="text-orange-500"
        tooltip="Número de tipos diferentes de objeções identificadas"
      />
      <StatCard
        title="Frequência Máxima"
        value={mostFrequent}
        icon={LineChart}
        color="text-blue-500"
        tooltip="Número de vezes que a objeção mais frequente apareceu"
      />
    </div>
  );
};
