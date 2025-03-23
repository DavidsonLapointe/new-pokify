
import { LucideIcon, Users, User, Building2, Briefcase, Phone } from "lucide-react";
import { Call } from "@/types/calls";
import { LeadCalls } from "./types";

// Define types for leads
export type LeadType = "client" | "employee" | "supplier" | "candidate" | "partner" | "prospect";

// Configuration for lead types
export const leadTypeConfig: Record<LeadType, { 
  label: string;
  color: string;
  icon: string;
}> = {
  client: {
    label: "Cliente",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: "User"
  },
  prospect: {
    label: "Prospect",
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    icon: "Phone"
  },
  employee: {
    label: "Funcionário",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: "Users"
  },
  supplier: {
    label: "Fornecedor",
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    icon: "Building2"
  },
  candidate: {
    label: "Candidato RH",
    color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    icon: "User"
  },
  partner: {
    label: "Parceiro",
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    icon: "Briefcase"
  }
};

// Temperature configuration
export const temperatureConfig = {
  hot: {
    label: "Quente",
    color: "text-red-500 border-red-500",
  },
  warm: {
    label: "Morno",
    color: "text-orange-500 border-orange-500",
  },
  cold: {
    label: "Frio",
    color: "text-blue-500 border-blue-500",
  }
};

// Helper function to get the lead name based on person type
export const getLeadName = (lead: {
  personType: "pf" | "pj";
  firstName: string;
  lastName?: string;
  razaoSocial?: string;
}): string => {
  if (lead.personType === "pj" && lead.razaoSocial) {
    return lead.razaoSocial;
  }
  
  return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
};

// Helper function to get detailed information about a lead for display
export const getLeadDetails = (lead: LeadCalls | null): string => {
  if (!lead) return "";
  
  // For person type "pj" (legal entity), show company info
  if (lead.personType === "pj" && lead.razaoSocial) {
    return `Empresa: ${lead.razaoSocial}`;
  }
  
  // For person type "pf" (individual), show name and any additional info
  const name = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
  return `Nome: ${name}`;
};

// Helper function to get the temperature from the last processed call
export const getLastCallTemperature = (calls: Call[]): "hot" | "warm" | "cold" | undefined => {
  // Find the most recent call with analysis that has temperature information
  const processedCalls = calls.filter(call => 
    call.status === "success" && 
    call.analysis?.sentiment?.temperature
  );
  
  if (processedCalls.length === 0) {
    return undefined;
  }
  
  // Sort by date descending and get the first one
  processedCalls.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
  
  return processedCalls[0].analysis?.sentiment?.temperature;
};
