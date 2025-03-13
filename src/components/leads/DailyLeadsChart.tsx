
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
import { SellerSelector } from "@/components/dashboard/SellerSelector";
import { User } from "@/types";
import { useMemo } from "react";
import { format, parse, isValid } from "date-fns";

interface DailyLeadsChartProps {
  data: any[];
  onDateChange: (date: Date) => void;
  selectedDate: Date;
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

export const DailyLeadsChart = ({ 
  data, 
  onDateChange, 
  selectedDate,
  selectedSeller,
  onSellerChange,
  sellers
}: DailyLeadsChartProps) => {
  // Filter data based on selected seller and selected date (month/year)
  const filteredData = useMemo(() => {
    // Certifique-se de que os dados não sejam nulos ou indefinidos
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('DailyLeadsChart: Nenhum dado disponível para exibição');
      return [];
    }

    console.log('DailyLeadsChart: Dados originais', data);
    console.log('DailyLeadsChart: Date selected', selectedDate);

    // First filter by month/year if a date is selected
    let dateFilteredData = [...data];
    if (selectedDate && isValid(selectedDate)) {
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();
      
      dateFilteredData = data.filter(item => {
        if (!item.day) {
          console.log('DailyLeadsChart: Item sem propriedade day', item);
          return false;
        }
        
        // Parse the day string to get a date object
        const itemDate = parse(item.day, 'dd/MM', new Date());
        // Se o formato for diferente, tente outro
        const isValidDate = isValid(itemDate);
        if (!isValidDate) {
          // Tente outro formato possível
          const alternateDate = parse(item.day, 'dd/MM/yyyy', new Date());
          if (isValid(alternateDate)) {
            return alternateDate.getMonth() === selectedMonth && 
                  alternateDate.getFullYear() === selectedYear;
          }
          console.log('DailyLeadsChart: Data inválida para o item', item.day);
          return false;
        }
        
        // Como não temos o ano no formato dd/MM, assumimos o ano atual
        itemDate.setFullYear(selectedYear);
        
        return itemDate.getMonth() === selectedMonth;
      });
      
      console.log('DailyLeadsChart: Dados filtrados por data', dateFilteredData);
    }
    
    // Then filter by seller if a specific seller is selected
    if (selectedSeller === "all") {
      return dateFilteredData; // Return data filtered only by date
    } else {
      // Return data for the specific seller
      const sellerFilteredData = dateFilteredData.map(item => ({
        ...item,
        novos: Math.floor(item.novos * (Math.random() * 0.5 + 0.2)) // Mock data for seller
      }));
      console.log('DailyLeadsChart: Dados filtrados por vendedor', sellerFilteredData);
      return sellerFilteredData;
    }
  }, [data, selectedSeller, selectedDate]);

  if (filteredData.length === 0) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Cadastro de novos leads por dia</h3>
            <div className="flex items-center gap-3">
              <MonthYearSelector
                selectedDate={selectedDate}
                onDateChange={onDateChange}
              />
              <div className="w-48">
                <SellerSelector 
                  selectedSeller={selectedSeller}
                  onSellerChange={onSellerChange}
                  sellers={sellers}
                />
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Cadastro de novos leads por dia</h3>
          <div className="flex items-center gap-3">
            <MonthYearSelector
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
            <div className="w-48">
              <SellerSelector 
                selectedSeller={selectedSeller}
                onSellerChange={onSellerChange}
                sellers={sellers}
              />
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
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
};
