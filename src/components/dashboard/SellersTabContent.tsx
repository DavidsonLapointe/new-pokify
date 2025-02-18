
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { User } from "@/types/organization";

interface SellersTabContentProps {
  sellers: User[];
}

export const SellersTabContent = ({ sellers }: SellersTabContentProps) => {
  const totalSellers = sellers.length;
  const activeSellers = sellers.filter(seller => seller.status === "active").length;
  const inactiveSellers = sellers.filter(seller => seller.status === "inactive").length;

  // Gerar dados dos últimos 13 meses
  const generateMonthlyData = () => {
    const today = new Date();
    const data = [];
    for (let i = 12; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      data.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        quantidade: Math.floor(Math.random() * 5) + (10 - i), // Simulação de dados
      });
    }
    return data;
  };

  const monthlyData = generateMonthlyData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-4">
          <p className="font-medium">{label}</p>
          {payload.map((item: any) => (
            <p
              key={item.dataKey}
              style={{ color: item.fill }}
              className="capitalize"
            >
              Quantidade: {item.value} vendedores
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Vendedores</h2>
        <p className="text-muted-foreground">
          Visão geral dos vendedores da organização
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Vendedores"
          value={totalSellers}
          icon={Users}
          tooltip="Número total de vendedores cadastrados na plataforma"
        />
        <StatCard
          title="Vendedores Ativos"
          value={activeSellers}
          icon={UserCheck}
          color="text-green-500"
          tooltip="Vendedores com status ativo no sistema"
        />
        <StatCard
          title="Vendedores Inativos"
          value={inactiveSellers}
          icon={UserX}
          color="text-red-500"
          tooltip="Vendedores com status inativo no sistema"
        />
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Evolução de Vendedores Cadastrados
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="quantidade" name="Vendedores" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};
