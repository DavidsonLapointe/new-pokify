
import { User } from "@/types/organization";

export interface Suggestion {
  id: string;
  date: string;
  leadName: string;
  suggestion: string;
  type: string;
  subType: string;
  status: "pending" | "implemented" | "rejected";
}

export interface SuggestionsFiltersProps {
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  subTypeFilter: string;
  setSubTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  monthlySuggestionsDate: Date;
  setMonthlySuggestionsDate: (date: Date) => void;
  monthlySuggestionsSeller: string;
  setMonthlySuggestionsSeller: (seller: string) => void;
  sellers: User[];
  types: string[];
  subTypes: string[];
  onClearFilters: () => void;
}

export interface SuggestionTableProps {
  suggestions: Suggestion[];
  onUpdateStatus?: (id: string, newStatus: "pending" | "implemented" | "rejected") => void;
}
