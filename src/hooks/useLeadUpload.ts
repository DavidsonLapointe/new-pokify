
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/types/leads";
import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";

export const useLeadUpload = (createNewLead: (data: LeadFormData) => Promise<string>, confirmNewLead: (withUpload: boolean, newCall?: Call) => void) => {
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedLeadForUpload, setSelectedLeadForUpload] = useState<Lead | null>(null);
  const [newLeadId, setNewLeadId] = useState<string | null>(null);
  const [pendingNewCall, setPendingNewCall] = useState<Call | null>(null);
  const [isCreateLeadSuccessOpen, setIsCreateLeadSuccessOpen] = useState(false);

  const createCallObject = (leadId: string, data: LeadFormData): Call => ({
    id: leadId,
    leadId,
    date: new Date().toISOString(),
    duration: "0:00",
    status: "failed",
    phone: data.phone || "",
    seller: "Sistema",
    audioUrl: "",
    mediaType: "audio",
    leadInfo: {
      personType: data.personType,
      firstName: data.firstName,
      lastName: data.lastName || "",
      razaoSocial: data.razaoSocial || "",
      email: data.email || "",
      phone: data.phone || "",
    },
    isNewLead: true,
    emptyLead: true
  });

  const handleCreateLead = async (data: LeadFormData) => {
    try {
      const leadId = await createNewLead(data);
      setNewLeadId(leadId);
      const newCall = createCallObject(leadId, data);
      setPendingNewCall(newCall);
      confirmNewLead(false, newCall);
      setIsCreateLeadSuccessOpen(true);
      return leadId;
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      throw error;
    }
  };

  const handleUploadClick = () => {
    console.log("handleUploadClick chamado com:", { newLeadId, pendingNewCall });
    if (newLeadId) {
      // Pequeno delay para garantir que o modal anterior fechou
      setTimeout(() => {
        setIsUploadOpen(true);
      }, 100);
    } else {
      console.error("Dados do lead não encontrados para upload");
    }
  };

  const handleUploadSuccess = () => {
    if (pendingNewCall) {
      const callWithUpload: Call = {
        ...pendingNewCall,
        emptyLead: false,
        status: "success"
      };
      confirmNewLead(true, callWithUpload);
    }
    setIsUploadOpen(false);
    setNewLeadId(null);
    setPendingNewCall(null);
    setIsCreateLeadSuccessOpen(false);
    
    toast({
      title: "Lead criado com sucesso",
      description: "O novo lead foi adicionado à lista com a primeira chamada.",
    });
  };

  const handleUploadCancel = () => {
    setIsUploadOpen(false);
    setNewLeadId(null);
    setPendingNewCall(null);
    setIsCreateLeadSuccessOpen(false);
    
    toast({
      title: "Operação cancelada",
      description: "O lead foi mantido sem chamadas.",
    });
  };

  const handleLeadFound = (lead: Lead) => {
    setSelectedLeadForUpload(lead);
    setIsUploadOpen(true);
  };

  return {
    isUploadOpen,
    setIsUploadOpen,
    selectedLeadForUpload,
    setSelectedLeadForUpload,
    newLeadId,
    isCreateLeadSuccessOpen,
    setIsCreateLeadSuccessOpen,
    handleCreateLead,
    handleUploadClick,
    handleUploadSuccess,
    handleUploadCancel,
    handleLeadFound,
  };
};
