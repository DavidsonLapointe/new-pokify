
import { useState, useMemo } from "react";
import { filterDataBySeller } from "./utils";

export const useObjectionsData = () => {
  const [monthlyObjectionsDate, setMonthlyObjectionsDate] = useState(() => new Date());
  const [monthlyObjectionsSeller, setMonthlyObjectionsSeller] = useState("all");
  const [objectionTrendsSeller, setObjectionTrendsSeller] = useState("all");

  // Mock objections data
  const objectionsData = useMemo(() => [
    { name: 'Preço alto', count: 15 },
    { name: 'Falta de recursos', count: 12 },
    { name: 'Já utiliza concorrente', count: 10 },
    { name: 'Sem orçamento', count: 8 },
    { name: 'Timing inadequado', count: 7 }
  ], []);

  // Mock objection trends data
  const objectionTrendsData = useMemo(() => [
    { month: 'Jan', count: 5 },
    { month: 'Fev', count: 7 },
    { month: 'Mar', count: 10 },
    { month: 'Abr', count: 8 },
    { month: 'Mai', count: 12 },
    { month: 'Jun', count: 15 },
  ], []);

  // Mock objection examples
  const objectionExamples = useMemo(() => [
    {
      id: "1",
      objection: "Preço alto",
      examples: [
        "O valor está muito acima do que tínhamos orçado",
        "Estamos com restrições orçamentárias neste momento",
        "A diferença de preço para o concorrente é significativa"
      ]
    },
    {
      id: "2",
      objection: "Falta de recursos",
      examples: [
        "Não temos equipe para implementar agora",
        "Nossa estrutura de TI está limitada",
        "Precisaríamos contratar mais pessoas para isso"
      ]
    }
  ], []);

  return {
    objectionsData,
    objectionTrendsData,
    objectionExamples,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller
  };
};
