
import { useState, useMemo } from "react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { leadsOrganizacao1 } from "@/mocks/leadsMocks";

export const useLeadsData = (organizationName?: string) => {
  // Usar os leads da Organização 1 se for essa a solicitada
  const organizationLeads = organizationName?.includes("1") ? leadsOrganizacao1 : leadsOrganizacao1;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSeller, setSelectedSeller] = useState("all");
  
  const monthlyLeadsData = useMemo(() => {
    // Agrupa leads por mês
    const leadsPerMonth = new Map();
    
    organizationLeads.forEach(lead => {
      const date = parseISO(lead.createdAt);
      const monthKey = format(date, 'MMM/yy', { locale: ptBR });
      
      if (!leadsPerMonth.has(monthKey)) {
        leadsPerMonth.set(monthKey, {
          month: monthKey,
          novos: 0,
          conversions: 0
        });
      }
      
      const monthData = leadsPerMonth.get(monthKey);
      monthData.novos += 1;
      
      // Lead com pelo menos uma chamada bem sucedida conta como conversão
      if (lead.calls?.some(call => call.status === "success")) {
        monthData.conversions += 1;
      }
    });
    
    return Array.from(leadsPerMonth.values()).sort((a, b) => {
      // Extrai o ano e o mês para comparação
      const [monthA, yearA] = a.month.split('/').reverse();
      const [monthB, yearB] = b.month.split('/').reverse();
      
      // Compara pelo ano primeiro, depois pelo mês
      return yearA === yearB 
        ? ptBR.localize?.month(ptBR.months.indexOf(monthA)) - ptBR.localize?.month(ptBR.months.indexOf(monthB))
        : parseInt(yearA) - parseInt(yearB);
    });
  }, [organizationLeads]);
  
  const dailyLeadsData = useMemo(() => {
    // Filtra leads do mês selecionado
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    const daysInMonth = new Map();
    
    // Inicializa todos os dias do mês
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      daysInMonth.set(`${formattedDay}/${format(selectedDate, 'MM')}`, {
        day: `${formattedDay}/${format(selectedDate, 'MM')}`,
        novos: 0,
        contactados: 0
      });
    }
    
    // Conta leads por dia
    organizationLeads.forEach(lead => {
      const leadDate = parseISO(lead.createdAt);
      
      if (isWithinInterval(leadDate, { start: monthStart, end: monthEnd })) {
        const dayKey = format(leadDate, 'dd/MM');
        
        if (daysInMonth.has(dayKey)) {
          const dayData = daysInMonth.get(dayKey);
          dayData.novos += 1;
          
          if (lead.status === "contacted") {
            dayData.contactados += 1;
          }
        }
      }
    });
    
    return Array.from(daysInMonth.values());
  }, [selectedDate, organizationLeads]);
  
  return {
    monthlyLeadsData,
    dailyLeadsData,
    selectedDate,
    setSelectedDate,
    selectedSeller,
    setSelectedSeller
  };
};
