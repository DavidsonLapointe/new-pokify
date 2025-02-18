
import { LeadFormData } from "@/schemas/leadFormSchema";
import { Integration } from "@/types/integration";

interface CRMLeadCheckResponse {
  exists: boolean;
  id?: string;
}

interface CRMIntegrationResponse {
  success: boolean;
  leadId?: string;
  error?: string;
}

export const checkLeadExistsInCRM = async (
  integration: Integration,
  leadData: LeadFormData
): Promise<CRMLeadCheckResponse> => {
  // Verifica se há dados suficientes para busca baseado no tipo de pessoa
  if (leadData.personType === "pj") {
    if (!leadData.razaoSocial && !leadData.cnpj) {
      console.log("Dados insuficientes para verificação de PJ no CRM");
      return { exists: false };
    }
  } else {
    // personType === "pf"
    if (!leadData.cpf && !leadData.email) {
      console.log("Dados insuficientes para verificação de PF no CRM");
      return { exists: false };
    }
  }

  try {
    // Aqui implementaremos a lógica específica para cada CRM
    switch (integration.name.toLowerCase()) {
      case "hubspot":
        return await checkLeadInHubspot(integration, leadData);
      case "salesforce":
        return await checkLeadInSalesforce(integration, leadData);
      default:
        console.log("CRM não suportado para verificação");
        return { exists: false };
    }
  } catch (error) {
    console.error("Erro ao verificar lead no CRM:", error);
    return { exists: false };
  }
}

const checkLeadInHubspot = async (
  integration: Integration,
  leadData: LeadFormData
): Promise<CRMLeadCheckResponse> => {
  // Simula uma chamada à API do HubSpot
  if (leadData.personType === "pj") {
    console.log("Verificando PJ no HubSpot:", {
      razaoSocial: leadData.razaoSocial,
      cnpj: leadData.cnpj
    });
  } else {
    console.log("Verificando PF no HubSpot:", {
      cpf: leadData.cpf,
      email: leadData.email
    });
  }

  // Aqui implementaremos a chamada real à API do HubSpot
  return { exists: false };
}

const checkLeadInSalesforce = async (
  integration: Integration,
  leadData: LeadFormData
): Promise<CRMLeadCheckResponse> => {
  // Simula uma chamada à API do Salesforce
  if (leadData.personType === "pj") {
    console.log("Verificando PJ no Salesforce:", {
      razaoSocial: leadData.razaoSocial,
      cnpj: leadData.cnpj
    });
  } else {
    console.log("Verificando PF no Salesforce:", {
      cpf: leadData.cpf,
      email: leadData.email
    });
  }

  // Aqui implementaremos a chamada real à API do Salesforce
  return { exists: false };
}

export const syncLeadWithCRM = async (
  integration: Integration,
  leadData: LeadFormData
): Promise<CRMIntegrationResponse> => {
  try {
    // Primeiro, verifica se o lead já existe
    const existingLead = await checkLeadExistsInCRM(integration, leadData);

    if (existingLead.exists) {
      const tipoPessoa = leadData.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica";
      console.log(`${tipoPessoa} já existe no CRM, não será criado novamente`);
      return {
        success: true,
        leadId: existingLead.id,
      };
    }

    // Se não existe, cria o lead no CRM
    console.log("Lead não encontrado no CRM, criando novo registro");
    
    // Implementação específica para cada CRM
    switch (integration.name.toLowerCase()) {
      case "hubspot":
        return await createLeadInHubspot(integration, leadData);
      case "salesforce":
        return await createLeadInSalesforce(integration, leadData);
      default:
        throw new Error("CRM não suportado");
    }
  } catch (error) {
    console.error("Erro ao sincronizar lead com CRM:", error);
    return {
      success: false,
      error: "Erro ao sincronizar lead com CRM"
    };
  }
}

const createLeadInHubspot = async (
  integration: Integration,
  leadData: LeadFormData
): Promise<CRMIntegrationResponse> => {
  // Simula criação no HubSpot
  console.log("Criando lead no HubSpot:", {
    tipo: leadData.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica",
    ...leadData
  });
  
  // Aqui implementaremos a chamada real à API do HubSpot
  return {
    success: true,
    leadId: "hubspot_" + Date.now()
  };
}

const createLeadInSalesforce = async (
  integration: Integration,
  leadData: LeadFormData
): Promise<CRMIntegrationResponse> => {
  // Simula criação no Salesforce
  console.log("Criando lead no Salesforce:", {
    tipo: leadData.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica",
    ...leadData
  });
  
  // Aqui implementaremos a chamada real à API do Salesforce
  return {
    success: true,
    leadId: "salesforce_" + Date.now()
  };
}
