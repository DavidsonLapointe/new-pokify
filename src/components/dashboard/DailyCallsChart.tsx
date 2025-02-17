
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
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";

interface DailyCallsChartProps {
  data: any[];
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

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
            {item.name}: {item.value} uploads
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DailyCallsChart = ({ data, selectedDate, onDateChange }: DailyCallsChartProps) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Uploads por dia</h3>
        {selectedDate && onDateChange && (
          <MonthYearSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        )}
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="uploads" name="Uploads" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
