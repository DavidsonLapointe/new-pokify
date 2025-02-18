
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, addDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export const usePerformanceData = () => {
  const [performanceDate, setPerformanceDate] = useState(() => new Date());

  const dailyPerformanceData = useMemo(() => {
    const monthStart = startOfMonth(performanceDate);
    const daysInMonth = endOfMonth(performanceDate).getDate();
    
    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        joao: Math.floor(Math.random() * 6) + 2,
        maria: Math.floor(Math.random() * 5) + 1,
      };
    });
  }, [performanceDate]);

  const monthlyPerformanceData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy', { locale: ptBR }),
        joao: Math.floor(Math.random() * 60) + 20,
        maria: Math.floor(Math.random() * 50) + 15,
      };
    }).reverse();
  }, []);

  return {
    dailyPerformanceData,
    monthlyPerformanceData,
    performanceDate,
    setPerformanceDate,
  };
};
