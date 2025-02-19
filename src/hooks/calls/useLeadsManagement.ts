
import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { LeadWithCalls } from "@/types/leads";
import { syncLeadWithCRM, syncCallWithCRM } from "@/services/crmIntegrationService";
import { Integration } from "@/types/integration";

interface CRMConfig {
  integration?: Integration;
  funnelName?: string;
  stageName?: string;
}

export const useLeadsManagement = (
  setLeads: React.Dispatch<React.SetStateAction<LeadWithCalls[]>>,
  setPendingLeadData: React.Dispatch<React.SetStateAction<LeadFormData | null>>,
  crmConfig?: CRMConfig
) => {
  const createNewLead = async (leadData: LeadFormData) => {
    console.log("Dados do lead recebidos em createNewLead:", leadData);
    const leadId = uuidv4();

    // Se houver integração com CRM e configuração de funil
    if (crmConfig?.integration && crmConfig.funnelName && crmConfig.stageName) {
      const syncResult = await syncLeadWithCRM(
        crmConfig.integration, 
        leadData,
        {
          funnelName: crmConfig.funnelName,
          stageName: crmConfig.stageName
        }
      );
      
      if (!syncResult.success) {
        toast.error("Erro na sincronização com CRM: " + syncResult.error);
      } else if (syncResult.leadId) {
        console.log("Lead sincronizado com CRM, ID:", syncResult.leadId);
      }
    }

    const newLead: LeadWithCalls = {
      id: leadId,
      leadInfo: {
        personType: leadData.personType,
        firstName: leadData.firstName,
        lastName: leadData.lastName || "",
        razaoSocial: leadData.razaoSocial || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
      },
      calls: [], // Inicializa com array vazio de chamadas
      createdAt: new Date().toISOString(),
      crmInfo: crmConfig?.funnelName ? {
        funnel: crmConfig.funnelName,
        stage: crmConfig.stageName || ""
      } : undefined
    };

    setLeads(prevLeads => {
      const updatedLeads = [newLead, ...prevLeads];
      console.log("Lista atualizada de leads:", updatedLeads);
      return updatedLeads;
    });

    setPendingLeadData(leadData);
    return leadId;
  };

  const handleUploadSuccess = async (leadId: string, uploadedCall: Call) => {
    if (crmConfig?.integration && crmConfig.funnelName && crmConfig.stageName) {
      const syncResult = await syncCallWithCRM(
        crmConfig.integration,
        uploadedCall,
        {
          funnelName: crmConfig.funnelName,
          stageName: crmConfig.stageName
        }
      );

      if (!syncResult.success) {
        toast.error("Erro ao sincronizar chamada com CRM: " + syncResult.error);
      }
    }

    setLeads(prevLeads => {
      return prevLeads.map(lead => {
        if (lead.id === leadId) {
          const updatedCalls = [
            uploadedCall,
            ...lead.calls
          ];
          
          return {
            ...lead,
            calls: updatedCalls,
            crmInfo: crmConfig?.funnelName ? {
              funnel: crmConfig.funnelName,
              stage: crmConfig.stageName || ""
            } : lead.crmInfo
          };
        }
        return lead;
      });
    });

    toast.success("Upload e sincronização realizados com sucesso");
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (withUpload && newCall) {
      setLeads(prevLeads => {
        return prevLeads.map(lead => {
          if (lead.id === newCall.leadId) {
            return {
              ...lead,
              calls: [newCall]
            };
          }
          return lead;
        });
      });
    }

    toast.success(withUpload ? "Upload da chamada realizado com sucesso" : "Lead criado com sucesso");
  };

  return { createNewLead, confirmNewLead, handleUploadSuccess };
};
