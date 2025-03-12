
import { useState, useMemo } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface DailyLeadsData {
  day: string;
  leads: number;
}

export interface MonthlyLeadsData {
  month: string;
  leads: number;
}

export const useLeadsData = () => {
  const [monthlyLeadsDate, setMonthlyLeadsDate] = useState(() => new Date());
  const [dailyLeadsDate, setDailyLeadsDate] = useState(() => new Date());
  const [monthlyLeadsSeller, setMonthlyLeadsSeller] = useState("all");
  const [dailyLeadsSeller, setDailyLeadsSeller] = useState("all");

  // Generate mock daily leads data for the current month
  const dailyLeadsData = useMemo(() => {
    const currentDate = new Date(dailyLeadsDate);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const data: DailyLeadsData[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      data.push({
        day: i.toString().padStart(2, '0'),
        leads: Math.floor(Math.random() * 10) + 1
      });
    }
    
    return data;
  }, [dailyLeadsDate, dailyLeadsSeller]);

  // Generate mock monthly leads data for the last 12 months
  const monthlyLeadsData = useMemo(() => {
    const data: MonthlyLeadsData[] = [];
    const currentDate = new Date(monthlyLeadsDate);
    
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const monthName = format(date, 'MMM', { locale: ptBR });
      const year = format(date, 'yy');
      
      data.push({
        month: `${monthName}/${year}`,
        leads: Math.floor(Math.random() * 50) + 10
      });
    }
    
    return data;
  }, [monthlyLeadsDate, monthlyLeadsSeller]);

  return {
    dailyLeadsData,
    monthlyLeadsData,
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
    monthlyLeadsSeller,
    setMonthlyLeadsSeller,
    dailyLeadsSeller,
    setDailyLeadsSeller
  };
};
