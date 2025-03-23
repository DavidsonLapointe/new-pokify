
import { useState } from "react";
import { Call } from "@/types/calls";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const useCallsPage = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleViewAnalysis = (call: Call) => {
    setSelectedCall(call);
    setIsAnalysisOpen(true);
  };

  const handleCloseAnalysis = () => {
    setIsAnalysisOpen(false);
    setTimeout(() => {
      setSelectedCall(null);
    }, 300);
  };

  const handlePlayAudio = (url: string) => {
    setAudioUrl(url);
    // In a real app, this would trigger audio playback
    console.log("Playing audio from:", url);
    
    // Just for demo, show a toast
    toast.info("Reproduzindo áudio...");
  };

  const createNewLead = async (data: LeadFormData): Promise<string> => {
    // In a real app, this would make an API call
    console.log("Creating new lead with data:", data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create and return a new ID
    const leadId = uuidv4();
    return leadId;
  };

  const confirmNewLead = (withUpload: boolean, newCall?: Call) => {
    console.log("Confirming new lead, with upload:", withUpload);
    console.log("New call data:", newCall);
    
    // In a real app, this would update the state or make additional API calls
    
    // Just for demo, show a toast
    toast.success(
      withUpload 
        ? "Lead criado e áudio processado com sucesso" 
        : "Lead criado com sucesso"
    );
  };

  return {
    selectedCall,
    isAnalysisOpen,
    audioUrl,
    handleViewAnalysis,
    handleCloseAnalysis,
    handlePlayAudio,
    createNewLead,
    confirmNewLead,
  };
};
