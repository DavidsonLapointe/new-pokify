
import { Users, Award, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface SellersStatsProps {
  totalSellers: number;
  activeSellers: number;
  topPerformerLeads: number;
}

export const SellersStats = ({ totalSellers, activeSellers, topPerformerLeads }: SellersStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total de Vendedores"
        value={totalSellers}
        icon={Users}
        tooltip="Número total de vendedores cadastrados"
      />
      <StatCard
        title="Vendedores Ativos"
        value={activeSellers}
        icon={TrendingUp}
        color="text-green-500"
        tooltip="Vendedores que realizaram pelo menos uma ação nos últimos 30 dias"
      />
      <StatCard
        title="Leads do Melhor Vendedor"
        value={topPerformerLeads}
        icon={Award}
        color="text-yellow-500"
        tooltip="Quantidade de leads do vendedor com melhor performance no mês"
      />
    </div>
  );
};
