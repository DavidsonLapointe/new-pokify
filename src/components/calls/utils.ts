
import { LeadCalls } from "./types";
import { Call } from "@/types/calls";

export const getLeadName = (lead: LeadCalls | null): string => {
  if (!lead) return "";
  
  if (lead.personType === "pj" && lead.razaoSocial) {
    return lead.razaoSocial;
  }
  
  return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
};

export const getLeadDetails = (lead: LeadCalls | null): string => {
  if (!lead) return "";
  
  if (lead.personType === "pj") {
    return `Empresa: ${lead.razaoSocial || "Não informado"}`;
  }
  
  return `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
};

export const getLastCallTemperature = (calls: Call[]): "hot" | "warm" | "cold" | null => {
  // Filter calls that have analysis with sentiment data
  const callsWithSentiment = calls.filter(
    call => call.status === "success" && call.analysis?.sentiment?.temperature
  );
  
  // Sort calls by date (descending) to get the most recent one
  const sortedCalls = callsWithSentiment.sort(
    (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
  );
  
  // Return the temperature of the most recent call, or null if none found
  return sortedCalls.length > 0 ? sortedCalls[0].analysis?.sentiment?.temperature || null : null;
};

export const temperatureConfig = {
  hot: {
    label: "Quente",
    color: "bg-red-100 text-red-800",
    description: "Lead com alta probabilidade de conversão"
  },
  warm: {
    label: "Morno",
    color: "bg-yellow-100 text-yellow-800",
    description: "Lead com média probabilidade de conversão"
  },
  cold: {
    label: "Frio",
    color: "bg-blue-100 text-blue-800",
    description: "Lead com baixa probabilidade de conversão"
  }
};
