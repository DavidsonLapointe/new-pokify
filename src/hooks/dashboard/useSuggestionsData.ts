
import { useState, useMemo } from "react";
import { filterDataBySeller } from "./utils";

export const useSuggestionsData = () => {
  const [monthlySuggestionsDate, setMonthlySuggestionsDate] = useState(() => new Date());
  const [monthlySuggestionsSeller, setMonthlySuggestionsSeller] = useState("all");
  const [suggestions, setSuggestions] = useState([
    {
      id: "1",
      date: "2024-02-19",
      leadName: "João Silva",
      suggestion: "Seria interessante ter uma opção de pagamento em boleto parcelado",
      type: "Financeiro",
      subType: "Formas de Pagamento",
      status: "pending"
    },
    {
      id: "2",
      date: "2024-02-18",
      leadName: "Maria Santos",
      suggestion: "Poderiam oferecer um plano mais básico com menos recursos",
      type: "Produto",
      subType: "Planos e Preços",
      status: "implemented"
    },
    {
      id: "3",
      date: "2024-02-17",
      leadName: "Pedro Oliveira",
      suggestion: "O processo de cadastro poderia ser mais simplificado",
      type: "UX/UI",
      subType: "Cadastro",
      status: "rejected"
    }
  ]);

  // Dados mockados filtrados
  const suggestionsData = useMemo(() => {
    return filterDataBySeller(suggestions, monthlySuggestionsSeller);
  }, [suggestions, monthlySuggestionsDate, monthlySuggestionsSeller]);

  const updateSuggestionStatus = (id: string, newStatus: "pending" | "implemented" | "rejected") => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id 
          ? { ...suggestion, status: newStatus }
          : suggestion
      )
    );
  };

  return {
    suggestionsData,
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
    updateSuggestionStatus,
  };
};
