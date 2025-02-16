
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

  const createCallObject = (leadId: string, data: LeadFormData): Call => ({
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
  });

  const handleCreateLead = (data: LeadFormData) => {
    // Cria o lead diretamente quando não vamos fazer upload
    const leadId = createNewLead(data);
    setNewLeadId(leadId);
    
    const newCall = createCallObject(leadId, data);
    setPendingNewCall(newCall);
    confirmNewLead(false, newCall); // Necessário para criar o lead sem upload
  };

  const handleUploadClick = (data: LeadFormData) => {
    // Não cria o lead aqui, apenas prepara para o upload
    const leadId = createNewLead(data);
    setNewLeadId(leadId);
    
    const newCall = createCallObject(leadId, data);
    setPendingNewCall(newCall);
    setIsUploadOpen(true);
  };

  const handleUploadSuccess = () => {
    if (pendingNewCall) {
      // Agora sim criamos o lead com a chamada
      confirmNewLead(true, pendingNewCall);
    }
    setIsUploadOpen(false);
    setNewLeadId(null);
    setPendingNewCall(null);
    
    toast({
      title: "Lead criado com sucesso",
      description: "O novo lead foi adicionado à lista com a primeira chamada.",
    });
  };

  const handleUploadCancel = () => {
    // Cria o lead sem chamada quando cancela o upload
    if (pendingNewCall) {
      confirmNewLead(false, pendingNewCall);
    }
    setIsUploadOpen(false);
    setNewLeadId(null);
    setPendingNewCall(null);
    
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
