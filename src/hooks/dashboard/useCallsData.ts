
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { filterDataBySeller } from "./utils";
import { useCallsPage } from "../useCallsPage";

export const useCallsData = () => {
  const { filteredLeads } = useCallsPage();
  const [monthlyCallsSeller, setMonthlyCallsSeller] = useState("all");
  const [dailyCallsSeller, setDailyCallsSeller] = useState("all");
  const [callsDate, setCallsDate] = useState(() => new Date());

  const dailyCallsData = useMemo(() => {
    const monthStart = startOfMonth(callsDate);
    const monthEnd = endOfMonth(callsDate);
    
    const uploadsByDay = new Map();
    
    filteredLeads.forEach(call => {
      if (!call.emptyLead) {
        const callDate = new Date(call.date);
        if (isWithinInterval(callDate, { start: monthStart, end: monthEnd })) {
          const dayKey = format(callDate, 'dd/MM');
          uploadsByDay.set(dayKey, (uploadsByDay.get(dayKey) || 0) + 1);
        }
      }
    });

    const daysInMonth = Array.from({ length: monthEnd.getDate() }, (_, i) => {
      const date = new Date(callsDate.getFullYear(), callsDate.getMonth(), i + 1);
      const dayKey = format(date, 'dd/MM');
      return {
        day: dayKey,
        uploads: uploadsByDay.get(dayKey) || 0
      };
    });

    return filterDataBySeller(daysInMonth, dailyCallsSeller);
  }, [callsDate, filteredLeads, dailyCallsSeller]);

  const monthlyCallsData = useMemo(() => {
    const today = new Date();
    const baseData = Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy', { locale: ptBR }),
        uploads: Math.floor(Math.random() * 50) + 20,
      };
    }).reverse();

    return filterDataBySeller(baseData, monthlyCallsSeller);
  }, [monthlyCallsSeller]);

  return {
    dailyCallsData,
    monthlyCallsData,
    callsDate,
    setCallsDate,
    monthlyCallsSeller,
    setMonthlyCallsSeller,
    dailyCallsSeller,
    setDailyCallsSeller,
  };
};
