
import { LeadFormData } from "@/schemas/leadFormSchema";
import { Integration } from "@/types/integration";
import { Call } from "@/types/calls";

interface CRMLeadCheckResponse {
  exists: boolean;
  id?: string;
}

interface CRMIntegrationResponse {
  success: boolean;
  leadId?: string;
  error?: string;
}

interface CRMFunnelConfig {
  funnelName: string;
  stageName: string;
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
  leadData: LeadFormData,
  funnelConfig: CRMFunnelConfig
): Promise<CRMIntegrationResponse> => {
  try {
    // Primeiro, verifica se o lead já existe
    const existingLead = await checkLeadExistsInCRM(integration, leadData);

    if (existingLead.exists) {
      console.log(`Lead já existe no CRM, ID: ${existingLead.id}`);
      return {
        success: true,
        leadId: existingLead.id,
      };
    }

    // Se não existe, cria o lead no CRM com o funil e etapa configurados
    console.log("Lead não encontrado no CRM, criando novo registro");
    console.log("Usando configurações de funil:", funnelConfig);
    
    switch (integration.name.toLowerCase()) {
      case "hubspot":
        return await createLeadInHubspot(integration, leadData, funnelConfig);
      case "salesforce":
        return await createLeadInSalesforce(integration, leadData, funnelConfig);
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
  leadData: LeadFormData,
  funnelConfig: CRMFunnelConfig
): Promise<CRMIntegrationResponse> => {
  console.log("Criando lead no HubSpot:", {
    tipo: leadData.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica",
    funil: funnelConfig.funnelName,
    etapa: funnelConfig.stageName,
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
  leadData: LeadFormData,
  funnelConfig: CRMFunnelConfig
): Promise<CRMIntegrationResponse> => {
  console.log("Criando lead no Salesforce:", {
    tipo: leadData.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica",
    funil: funnelConfig.funnelName,
    etapa: funnelConfig.stageName,
    ...leadData
  });
  
  // Aqui implementaremos a chamada real à API do Salesforce
  return {
    success: true,
    leadId: "salesforce_" + Date.now()
  };
}

export const syncCallWithCRM = async (
  integration: Integration,
  call: Call,
  funnelConfig: CRMFunnelConfig
): Promise<CRMIntegrationResponse> => {
  try {
    // Converte os dados do call para o formato do lead
    const leadData: LeadFormData = {
      personType: call.leadInfo.personType,
      firstName: call.leadInfo.firstName,
      lastName: call.leadInfo.lastName || "",
      email: call.leadInfo.email || "",
      phone: call.leadInfo.phone || "",
      company: call.leadInfo.company,
      position: call.leadInfo.position,
    };

    // Sincroniza com o CRM
    return await syncLeadWithCRM(integration, leadData, funnelConfig);
  } catch (error) {
    console.error("Erro ao sincronizar chamada com CRM:", error);
    return {
      success: false,
      error: "Erro ao sincronizar chamada com CRM"
    };
  }
}
