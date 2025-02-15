
import { LeadCalls } from "./types";
import { Call, LeadTemperature } from "@/types/calls";

export const temperatureConfig: Record<LeadTemperature, { label: string; color: string }> = {
  cold: { label: "Lead Frio", color: "bg-blue-100 text-blue-800" },
  warm: { label: "Lead Morno", color: "bg-yellow-100 text-yellow-800" },
  hot: { label: "Lead Quente", color: "bg-red-100 text-red-800" },
};

export const getLeadName = (lead: LeadCalls) => {
  if (lead.personType === "pf") {
    return `${lead.firstName} ${lead.lastName || ""}`;
  }
  return lead.razaoSocial;
};

export const getLeadStatus = (callCount: number) => {
  return callCount === 0 ? "pending" : "active";
};

export const getLastCallTemperature = (calls: Call[]) => {
  const sortedCalls = [...calls].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastCallWithAnalysis = sortedCalls.find(call => call.analysis?.sentiment?.temperature);
  
  return lastCallWithAnalysis?.analysis?.sentiment?.temperature || null;
};

export const getLeadDetails = (lead: LeadCalls | null) => {
  if (!lead) return null;

  const details = [];
  if (lead.personType === "pj") {
    details.push(`Razão Social: ${lead.razaoSocial}`);
  }
  
  const firstCall = lead.calls[0];
  if (firstCall) {
    if (firstCall.phone) details.push(`Tel: ${firstCall.phone}`);
    if (firstCall.leadInfo.email) details.push(`Email: ${firstCall.leadInfo.email}`);
  }

  return details.join(" • ");
};
