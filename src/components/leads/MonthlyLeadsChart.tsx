
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { SellerSelector } from "@/components/dashboard/SellerSelector";
import { User } from "@/types/organization";

interface MonthlyLeadsChartProps {
  data: Array<{
    month: string;
    novos: number;
  }>;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
  sellers: User[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          Novos Leads: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const MonthlyLeadsChart = ({ 
  data, 
  selectedSeller,
  onSellerChange,
  sellers
}: MonthlyLeadsChartProps) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cadastro de novos leads por mês</h3>
        <SellerSelector 
          selectedSeller={selectedSeller}
          onSellerChange={onSellerChange}
          sellers={sellers}
        />
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-30}
              textAnchor="end"
              height={40}
              interval={0}
              tick={{ fontSize: 13 }}
            />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="novos" name="Novos Leads" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
