
import { Call, LeadTemperature } from "@/types/calls";
import { LeadCalls } from "./types";
import * as LucideIcons from "lucide-react";

// Type definition for lead types
export type LeadType = "client" | "prospect" | "employee" | "candidate" | "supplier" | "partner";

/**
 * Gets the formatted name of a lead based on its type (person or company)
 */
export const getLeadName = (lead: LeadCalls): string => {
  if (lead.personType === "pj" && lead.razaoSocial) {
    return lead.razaoSocial;
  }
  
  return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
};

/**
 * Gets detailed information about a lead for display
 */
export const getLeadDetails = (lead: LeadCalls | null): string => {
  if (!lead) return "";
  
  if (lead.personType === "pj" && lead.razaoSocial) {
    // Return business details
    const callCount = lead.calls?.length || 0;
    return `Empresa | ${callCount} ${callCount === 1 ? 'interação' : 'interações'}`;
  } else {
    // Return person details
    const callCount = lead.calls?.length || 0;
    return `Pessoa Física | ${callCount} ${callCount === 1 ? 'interação' : 'interações'}`;
  }
};

/**
 * Gets the temperature of the last processed call
 */
export const getLastCallTemperature = (calls: Call[]): LeadTemperature | null => {
  if (!calls || calls.length === 0) return null;
  
  // Find the last call with an analysis that includes temperature
  const processedCalls = calls.filter(
    call => call.status === "processed" || call.status === "success"
  );
  
  if (processedCalls.length === 0) return null;
  
  // Sort by date descending
  const sortedCalls = [...processedCalls].sort(
    (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
  );
  
  // Return the temperature from the most recent call with an analysis
  for (const call of sortedCalls) {
    if (call.analysis?.sentiment?.temperature) {
      return call.analysis.sentiment.temperature;
    }
  }
  
  return null;
};

/**
 * Configuration for temperature display
 */
export const temperatureConfig = {
  hot: {
    label: "Quente",
    color: "text-red-500 border-red-500",
    description: "Lead demonstrou grande interesse no produto."
  },
  warm: {
    label: "Morno",
    color: "text-amber-500 border-amber-500",
    description: "Lead demonstrou interesse moderado no produto."
  },
  cold: {
    label: "Frio",
    color: "text-blue-500 border-blue-500",
    description: "Lead apresenta baixo interesse no momento."
  }
};

/**
 * Configuration for lead type display
 */
export const leadTypeConfig = {
  client: {
    label: "Cliente",
    color: "bg-green-100 text-green-800",
    icon: "UserCheck"
  },
  prospect: {
    label: "Prospect",
    color: "bg-blue-100 text-blue-800",
    icon: "Users"
  },
  employee: {
    label: "Funcionário",
    color: "bg-purple-100 text-purple-800",
    icon: "Briefcase"
  },
  candidate: {
    label: "Candidato RH",
    color: "bg-indigo-100 text-indigo-800",
    icon: "GraduationCap"
  },
  supplier: {
    label: "Fornecedor",
    color: "bg-amber-100 text-amber-800",
    icon: "Package"
  },
  partner: {
    label: "Parceiro",
    color: "bg-orange-100 text-orange-800",
    icon: "Handshake"
  }
};
