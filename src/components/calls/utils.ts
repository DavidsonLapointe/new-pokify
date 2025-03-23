
import { Call } from "@/types/calls";
import { LeadCalls } from "./types";
import { CircleDollarSign, Users, Briefcase, TruckIcon, Building, UserRound, Send, UserSquare } from "lucide-react";

// Define LeadType enumeration
export type LeadType = "client" | "employee" | "supplier" | "partner" | "prospect" | "candidate" | "other";

// Configuration for different lead types
export const leadTypeConfig = {
  client: {
    label: "Cliente",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "Building"
  },
  employee: {
    label: "Funcionário",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "UserRound"
  },
  supplier: {
    label: "Fornecedor",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: "TruckIcon"
  },
  partner: {
    label: "Parceiro",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "Briefcase"
  },
  prospect: {
    label: "Prospect",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: "Users"
  },
  candidate: {
    label: "Candidato RH",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: "UserSquare"
  },
  other: {
    label: "Outro",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "CircleDollarSign"
  }
};

// Temperature configuration for leads
export const temperatureConfig = {
  hot: {
    label: "Quente",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: "Flame",
  },
  warm: {
    label: "Morno",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "Thermometer",
  },
  cold: {
    label: "Frio",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "Snowflake",
  },
};

/**
 * Obtém o nome formatado do lead com base no tipo de pessoa.
 */
export const getLeadName = (lead: LeadCalls | null): string => {
  if (!lead) return "Lead não encontrado";
  
  if (lead.personType === "pj" && lead.razaoSocial) {
    return lead.razaoSocial;
  }
  
  return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
};

/**
 * Obtém os detalhes do lead para exibição.
 */
export const getLeadDetails = (lead: LeadCalls | null): string => {
  if (!lead) return "";
  
  if (lead.personType === "pj" && lead.razaoSocial) {
    return `${lead.leadType ? leadTypeConfig[lead.leadType].label : 'Lead'} - ${lead.razaoSocial}`;
  }
  
  return `${lead.leadType ? leadTypeConfig[lead.leadType].label : 'Lead'} - ${lead.firstName} ${lead.lastName || ''}`.trim();
};

/**
 * Obtém a temperatura do lead com base na chamada mais recente.
 * Retorna null se não houver chamadas ou se não tiver análise.
 */
export const getLastCallTemperature = (calls: Call[] = []): "hot" | "warm" | "cold" | null => {
  if (!calls || calls.length === 0) return null;
  
  // Procura pela chamada mais recente com análise de sentimento
  const callWithAnalysis = calls.find(call => 
    call.status === "success" && 
    call.analysis?.sentiment?.temperature
  );
  
  return callWithAnalysis?.analysis?.sentiment?.temperature || null;
};
