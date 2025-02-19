
import { useState, useMemo } from "react";
import { filterDataBySeller } from "./utils";

export const useSuggestionsData = () => {
  const [monthlySuggestionsDate, setMonthlySuggestionsDate] = useState(() => new Date());
  const [monthlySuggestionsSeller, setMonthlySuggestionsSeller] = useState("all");

  // Dados mockados para exemplo
  const suggestionsData = useMemo(() => {
    const baseData = [
      {
        id: "1",
        date: "2024-02-19",
        leadName: "João Silva",
        suggestion: "Seria interessante ter uma opção de pagamento em boleto parcelado",
        status: "pending"
      },
      {
        id: "2",
        date: "2024-02-18",
        leadName: "Maria Santos",
        suggestion: "Poderiam oferecer um plano mais básico com menos recursos",
        status: "implemented"
      },
      {
        id: "3",
        date: "2024-02-17",
        leadName: "Pedro Oliveira",
        suggestion: "O processo de cadastro poderia ser mais simplificado",
        status: "rejected"
      }
    ];

    return filterDataBySeller(baseData, monthlySuggestionsSeller);
  }, [monthlySuggestionsDate, monthlySuggestionsSeller]);

  return {
    suggestionsData,
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
  };
};
