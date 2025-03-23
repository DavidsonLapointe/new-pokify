
import { LeadCalls } from "./types";
import { Call, LeadTemperature } from "@/types/calls";

export const temperatureConfig: Record<LeadTemperature, { label: string; color: string }> = {
  cold: { label: "Lead Frio", color: "bg-blue-100 text-blue-800" },
  warm: { label: "Lead Morno", color: "bg-yellow-100 text-yellow-800" },
  hot: { label: "Lead Quente", color: "bg-red-100 text-red-800" },
};

export const getLeadName = (lead: any) => {
  if (!lead) return ""; // Return empty string if lead is null
  
  if (lead.personType === "pj") {
    // Empresa (PJ)
    return lead.razaoSocial || `${lead.firstName} ${lead.lastName || ""}`.trim();
  }
  
  // Pessoa Física (PF)
  return `${lead.firstName} ${lead.lastName || ""}`.trim();
};

// Determina o status visual do lead para exibição na tabela
export const getLeadStatus = (lead: any): "active" | "pending" => {
  // Se o lead tem pelo menos uma chamada, é considerado ativo
  const hasCallHistory = lead.calls && lead.calls.length > 0;
  
  if (hasCallHistory) {
    return "active";
  }
  
  return "pending";
};

// Função para obter o status detalhado interno do lead (para logs e processamento)
export const getDetailedLeadStatus = (lead: any) => {
  const internalStatus = lead.status || "pending";
  
  // Mapeamento dos status detalhados
  const statusMap: Record<string, string> = {
    "pending": "Pendente de contato",
    "contacted": "Contatado",
    "failed": "Falha no contato",
    "qualified": "Qualificado",
    "negotiation": "Em negociação"
  };
  
  return statusMap[internalStatus] || statusMap["pending"];
};

// Função para converter temperatura em texto legível
export const getTemperatureText = (temperature: string | undefined) => {
  const tempMap: Record<string, string> = {
    "cold": "Lead Morno",
    "warm": "Lead Morno",
    "hot": "Lead Quente"
  };
  
  return temperature ? tempMap[temperature] : "Sem classificação";
};

// Function to get the temperature of the last call
export const getLastCallTemperature = (calls: Call[]) => {
  if (!calls || calls.length === 0) return null;
  
  // Filter out empty calls before processing
  const validCalls = calls.filter(call => !call.emptyLead);
  
  const sortedCalls = [...validCalls].sort((a, b) => 
    new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
  );

  const lastCallWithAnalysis = sortedCalls.find(call => call.analysis?.sentiment?.temperature);
  
  return lastCallWithAnalysis?.analysis?.sentiment?.temperature || null;
};

// Function to get lead details for display
export const getLeadDetails = (lead: LeadCalls | null) => {
  if (!lead) return ""; // Return empty string if lead is null
  
  const details = [];
  if (lead.personType === "pj") {
    details.push(`Razão Social: ${lead.razaoSocial}`);
  }
  
  // Use only valid calls
  const validCalls = lead.calls.filter(call => !call.emptyLead);
  const firstCall = validCalls[0];
  
  if (firstCall) {
    if (firstCall.phone) details.push(`Tel: ${firstCall.phone}`);
    if (firstCall.leadInfo?.email) details.push(`Email: ${firstCall.leadInfo.email}`);
  }

  return details.join(" • ");
};
