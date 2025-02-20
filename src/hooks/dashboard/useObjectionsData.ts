
import { useState, useMemo } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { filterDataBySeller } from "./utils";

export const useObjectionsData = () => {
  const [monthlyObjectionsDate, setMonthlyObjectionsDate] = useState<Date>(() => new Date());
  const [monthlyObjectionsSeller, setMonthlyObjectionsSeller] = useState("all");
  const [objectionTrendsSeller, setObjectionTrendsSeller] = useState("all");

  const objectionsData = useMemo(() => {
    // Ensure we have a valid date object
    const date = monthlyObjectionsDate instanceof Date ? monthlyObjectionsDate : new Date();
    const monthYear = format(date, 'MM/yyyy');
    const seed = parseInt(monthYear.replace('/', ''));
    
    const baseData = [
      { name: "Preço muito alto", count: 28 + (seed % 10) },
      { name: "Não tenho orçamento no momento", count: 24 + (seed % 8) },
      { name: "Preciso consultar outras pessoas", count: 20 + (seed % 6) },
      { name: "Já uso outro produto similar", count: 18 + (seed % 5) },
      { name: "Não é prioridade agora", count: 15 + (seed % 7) },
      { name: "Não entendi o valor agregado", count: 12 + (seed % 4) },
      { name: "Preciso de mais tempo para avaliar", count: 10 + (seed % 3) },
    ].sort((a, b) => b.count - a.count);

    return filterDataBySeller(baseData, monthlyObjectionsSeller);
  }, [monthlyObjectionsDate, monthlyObjectionsSeller]);

  const objectionTrendsData = useMemo(() => {
    const currentDate = new Date();
    
    return Array.from({ length: 6 }).map((_, index) => {
      const date = subMonths(currentDate, 5 - index);
      const monthSeed = parseInt(format(date, 'MMyyy'));
      
      return {
        date: format(date, 'MMM/yy', { locale: ptBR }),
        count: 15 + (monthSeed % 25) // Random count between 15 and 40
      };
    });
  }, [objectionTrendsSeller]);

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
    objectionsData,
    objectionTrendsData,
    objectionExamples,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller,
  };
};
