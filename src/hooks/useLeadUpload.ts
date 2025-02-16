
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/types/leads";
import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";

export const useLeadUpload = (createNewLead: (data: LeadFormData) => string, confirmNewLead: (withUpload: boolean, newCall?: Call) => void) => {
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedLeadForUpload, setSelectedLeadForUpload] = useState<Lead | null>(null);
  const [newLeadId, setNewLeadId] = useState<string | null>(null);
  const [pendingNewCall, setPendingNewCall] = useState<Call | null>(null);

  const handleCreateLead = (data: LeadFormData) => {
    const leadId = createNewLead(data);
    setNewLeadId(leadId);
    
    const newCall: Call = {
      id: leadId,
      leadId,
      date: new Date().toISOString(),
      duration: "0:00",
      status: "pending",
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
    };
    
    setPendingNewCall(newCall);
  };

  const handleUploadClick = (data: LeadFormData) => {
    const leadId = createNewLead(data);
    setNewLeadId(leadId);
    setIsUploadOpen(true);
  };

  const handleUploadSuccess = () => {
    if (pendingNewCall) {
      confirmNewLead(true, pendingNewCall);
      setPendingNewCall(null);
    }
    setIsUploadOpen(false);
    setNewLeadId(null);
    
    toast({
      title: "Lead criado com sucesso",
      description: "O novo lead foi adicionado à lista com a primeira chamada.",
    });
  };

  const handleUploadCancel = () => {
    if (pendingNewCall) {
      confirmNewLead(false, pendingNewCall);
      setPendingNewCall(null);
    }
    setIsUploadOpen(false);
    setNewLeadId(null);
    
    toast({
      title: "Lead criado com sucesso",
      description: "O novo lead foi adicionado à lista sem chamadas.",
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
    handleCreateLead,
    handleUploadClick,
    handleUploadSuccess,
    handleUploadCancel,
    handleLeadFound,
  };
};
