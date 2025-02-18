import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { LeadWithCalls } from "@/types/leads";
import { syncLeadWithCRM } from "@/services/crmIntegrationService";
import { Integration } from "@/types/integration";

export const useLeadsManagement = (
  setLeads: React.Dispatch<React.SetStateAction<LeadWithCalls[]>>,
  setPendingLeadData: React.Dispatch<React.SetStateAction<LeadFormData | null>>,
  crmIntegration?: Integration
) => {
  const createNewLead = async (leadData: LeadFormData) => {
    console.log("Dados do lead recebidos em createNewLead:", leadData);
    const leadId = uuidv4();

    // Se houver integração com CRM, sincroniza o lead
    if (crmIntegration) {
      const syncResult = await syncLeadWithCRM(crmIntegration, leadData);
      
      if (!syncResult.success) {
        toast({
          title: "Erro na sincronização com CRM",
          description: syncResult.error,
          variant: "destructive",
        });
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
      calls: [],
      createdAt: new Date().toISOString()
    };

    setLeads(prevLeads => {
      const updatedLeads = [newLead, ...prevLeads];
      console.log("Lista atualizada de leads:", updatedLeads);
      return updatedLeads;
    });

    setPendingLeadData(leadData);
    return leadId;
  };

  const confirmNewLead = (withUpload: boolean = false, newCall?: Call) => {
    if (withUpload && newCall) {
      setLeads(prevLeads => {
        return prevLeads.map(lead => {
          if (lead.id === newCall.leadId) {
            return {
              ...lead,
              calls: [newCall, ...lead.calls.filter(call => !call.emptyLead)]
            };
          }
          return lead;
        });
      });
    }

    toast({
      title: "Lead atualizado com sucesso",
      description: withUpload ? "Upload da chamada realizado com sucesso." : "Lead criado com sucesso.",
    });
  };

  const handleUploadSuccess = (leadId: string, uploadedCall: Call) => {
    setLeads(prevLeads => {
      return prevLeads.map(lead => {
        if (lead.id === leadId) {
          const updatedCalls = [
            uploadedCall,
            ...lead.calls.filter(call => !call.emptyLead)
          ];
          
          return {
            ...lead,
            calls: updatedCalls
          };
        }
        return lead;
      });
    });

    toast({
      title: "Upload realizado com sucesso",
      description: "A chamada foi adicionada ao histórico do lead.",
    });
  };

  return { createNewLead, confirmNewLead, handleUploadSuccess };
};
