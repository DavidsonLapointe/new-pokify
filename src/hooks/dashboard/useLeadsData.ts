
import { useState, useMemo } from "react";
import { format, subMonths, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface DailyLeadsData {
  day: string;
  novos: number; // Alterando de 'leads' para 'novos' para corresponder ao DailyLeadsChart
}

export interface MonthlyLeadsData {
  month: string;
  novos: number; // Alterando de 'leads' para 'novos' para corresponder ao MonthlyLeadsChart
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
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const day = addDays(startOfMonth, i - 1);
      data.push({
        day: format(day, 'dd/MM'),
        novos: Math.floor(Math.random() * 10) + 1
      });
    }
    
    return data;
  }, [dailyLeadsDate, dailyLeadsSeller]);

  // Generate mock monthly leads data for the last 13 months
  const monthlyLeadsData = useMemo(() => {
    const data: MonthlyLeadsData[] = [];
    const currentDate = new Date(monthlyLeadsDate);
    
    // Gerando 13 meses (em vez de 12) para atender ao requisito
    for (let i = 12; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const monthName = format(date, 'MMM', { locale: ptBR });
      const year = format(date, 'yy');
      
      data.push({
        month: `${monthName}/${year}`,
        novos: Math.floor(Math.random() * 50) + 10
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
