
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
    // 3. Cria o lead com qtde de chamadas zero
    const leadId = createNewLead(data);
    setNewLeadId(leadId);
    
    // Confirma a criação do lead sem chamada
    confirmNewLead(false);
    
    // Cria o objeto de chamada mas mantém como pendente
    const newCall = createCallObject(leadId, data);
    setPendingNewCall(newCall);
  };

  const handleUploadClick = (data: LeadFormData) => {
    // 5. Apenas abre o modal de upload
    setIsUploadOpen(true);
  };

  const handleUploadSuccess = () => {
    if (pendingNewCall) {
      // 7. Atualiza o lead para incluir a chamada após o upload
      const callWithUpload = {
        ...pendingNewCall,
        emptyLead: false,
        status: "success"
      };
      confirmNewLead(true, callWithUpload);
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
    // 6. Apenas fecha o modal, mantendo o lead com zero chamadas
    setIsUploadOpen(false);
    setNewLeadId(null);
    setPendingNewCall(null);
    
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
    handleCreateLead,
    handleUploadClick,
    handleUploadSuccess,
    handleUploadCancel,
    handleLeadFound,
  };
};
