
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, addDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { filterDataBySeller } from "./utils";

export const useLeadsData = () => {
  const [monthlyLeadsDate, setMonthlyLeadsDate] = useState(() => new Date());
  const [dailyLeadsDate, setDailyLeadsDate] = useState(() => new Date());
  const [monthlyLeadsSeller, setMonthlyLeadsSeller] = useState("all");
  const [dailyLeadsSeller, setDailyLeadsSeller] = useState("all");

  const dailyLeadsData = useMemo(() => {
    const monthStart = startOfMonth(dailyLeadsDate);
    const daysInMonth = endOfMonth(dailyLeadsDate).getDate();
    
    const baseData = Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        novos: Math.floor(Math.random() * 5) + 1,
      };
    });

    return filterDataBySeller(baseData, dailyLeadsSeller);
  }, [dailyLeadsDate, dailyLeadsSeller]);

  const monthlyLeadsData = useMemo(() => {
    const today = new Date();
    const baseData = Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy', { locale: ptBR }),
        novos: Math.floor(Math.random() * 50) + 20,
      };
    }).reverse();

    return filterDataBySeller(baseData, monthlyLeadsSeller);
  }, [monthlyLeadsSeller]);

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
    setDailyLeadsSeller,
  };
};
