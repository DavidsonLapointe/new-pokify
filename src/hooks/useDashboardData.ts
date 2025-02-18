
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, addDays, subMonths, isWithinInterval } from "date-fns";
import { useCallsPage } from "./useCallsPage";
import { mockUsers } from "@/types/organization";

export const useDashboardData = () => {
  const { monthStats, filteredLeads } = useCallsPage();
  
  // Estados separados para cada seletor
  const [monthlyLeadsDate, setMonthlyLeadsDate] = useState(() => new Date());
  const [dailyLeadsDate, setDailyLeadsDate] = useState(() => new Date());
  const [objectionsDate, setObjectionsDate] = useState(() => new Date());
  const [callsDate, setCallsDate] = useState(() => new Date());
  const [performanceDate, setPerformanceDate] = useState(() => new Date());
  
  const [monthlyLeadsSeller, setMonthlyLeadsSeller] = useState("all");
  const [dailyLeadsSeller, setDailyLeadsSeller] = useState("all");
  const [objectionsSeller, setObjectionsSeller] = useState("all");

  const filterDataBySeller = (data: any[], sellerId: string) => {
    if (sellerId === "all") return data;
    const multiplier = parseInt(sellerId) * 0.5;
    return data.map(item => ({
      ...item,
      novos: Math.floor(item.novos * multiplier),
      count: item.count ? Math.floor(item.count * multiplier) : undefined
    }));
  };

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
        month: format(date, 'MMM/yy'),
        novos: Math.floor(Math.random() * 50) + 20,
      };
    }).reverse();

    return filterDataBySeller(baseData, monthlyLeadsSeller);
  }, [monthlyLeadsSeller]);

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

    return daysInMonth;
  }, [callsDate, filteredLeads]);

  const monthlyCallsData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 13 }).map((_, index) => {
      const date = subMonths(today, index);
      return {
        month: format(date, 'MMM/yy'),
        uploads: Math.floor(Math.random() * 50) + 20,
      };
    }).reverse();
  }, []);

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

  const objectionsData = useMemo(() => {
    const baseData = [
      { name: "Preço muito alto", count: 28 },
      { name: "Não tenho orçamento no momento", count: 24 },
      { name: "Preciso consultar outras pessoas", count: 20 },
      { name: "Já uso outro produto similar", count: 18 },
      { name: "Não é prioridade agora", count: 15 },
      { name: "Não entendi o valor agregado", count: 12 },
      { name: "Preciso de mais tempo para avaliar", count: 10 },
    ].sort((a, b) => b.count - a.count);

    return filterDataBySeller(baseData, objectionsSeller);
  }, [objectionsSeller]);

  const objectionExamples = useMemo(() => ({
    "Preço muito alto": [
      "O valor está acima do nosso orçamento atual",
      "Encontramos soluções mais baratas no mercado",
      "Precisamos de um desconto maior para aprovar"
    ],
    "Não tenho orçamento no momento": [
      "Nosso orçamento já foi definido para este ano",
      "Precisamos esperar o próximo trimestre",
      "Estamos com restrições orçamentárias"
    ],
  }), []);

  return {
    monthStats,
    dailyLeadsData,
    monthlyLeadsData,
    dailyCallsData,
    monthlyCallsData,
    dailyPerformanceData,
    objectionsData,
    objectionExamples,
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
    objectionsDate,
    setObjectionsDate,
    callsDate,
    setCallsDate,
    performanceDate,
    setPerformanceDate,
    monthlyLeadsSeller,
    setMonthlyLeadsSeller,
    dailyLeadsSeller,
    setDailyLeadsSeller,
    objectionsSeller,
    setObjectionsSeller,
  };
};
