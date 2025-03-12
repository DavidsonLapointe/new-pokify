
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, addDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export type PerformanceMetric = "leads" | "uploads" | "logins" | "joao" | "maria";

export interface DailyPerformanceData {
  day: string;
  joao: number;
  maria: number;
}

export interface MonthlyPerformanceData {
  month: string;
  joao: number;
  maria: number;
}

export const usePerformanceData = () => {
  const [performanceDate, setPerformanceDate] = useState(() => new Date());
  const [dailyMetric, setDailyMetric] = useState<PerformanceMetric>("joao");
  const [monthlyMetric, setMonthlyMetric] = useState<PerformanceMetric>("joao");

  const getRandomValue = (metric: PerformanceMetric, isMonthly: boolean) => {
    switch (metric) {
      case "leads":
        return isMonthly ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 6) + 2;
      case "uploads":
        return isMonthly ? Math.floor(Math.random() * 40) + 15 : Math.floor(Math.random() * 4) + 1;
      case "logins":
        return isMonthly ? Math.floor(Math.random() * 100) + 30 : Math.floor(Math.random() * 8) + 3;
      case "joao":
      case "maria":
      default:
        return isMonthly ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 5) + 1;
    }
  };

  const dailyPerformanceData: DailyPerformanceData[] = useMemo(() => {
    const monthStart = startOfMonth(performanceDate);
    const daysInMonth = endOfMonth(performanceDate).getDate();
    
    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(monthStart, index);
      return {
        day: format(date, 'dd/MM'),
        joao: getRandomValue("joao", false),
        maria: getRandomValue("maria", false),
      };
    });
  }, [performanceDate, dailyMetric]);

  const monthlyPerformanceData: MonthlyPerformanceData[] = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy', { locale: ptBR }),
        joao: getRandomValue("joao", true),
        maria: getRandomValue("maria", true),
      };
    }).reverse();
  }, [monthlyMetric]);

  return {
    dailyPerformanceData,
    monthlyPerformanceData,
    performanceDate,
    setPerformanceDate,
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
  };
};
