
export const getLeadName = (lead: any) => {
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
