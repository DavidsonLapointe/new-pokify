
import { useState } from "react";
import { toast } from "sonner";
import { Funnel } from "@/components/settings/types";

export const useFunnelManagement = (initialFunnels: Funnel[] = []) => {
  const [funnels, setFunnels] = useState<Funnel[]>(initialFunnels);
  const [selectedFunnel, setSelectedFunnel] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [newFunnel, setNewFunnel] = useState("");
  const [newStage, setNewStage] = useState("");
  const [newStageFunnelId, setNewStageFunnelId] = useState<string>("");
  const [isDefaultConfigSaved, setIsDefaultConfigSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveFunnel = () => {
    if (!newFunnel) {
      toast.error("Digite o nome do funil");
      return;
    }

    const funnel: Funnel = {
      id: crypto.randomUUID(),
      name: newFunnel,
      stages: [],
    };

    setFunnels(prev => [...prev, funnel]);
    setNewFunnel("");
    toast.success("Funil criado com sucesso");
  };

  const handleSaveStage = () => {
    if (!newStageFunnelId || !newStage) {
      toast.error("Selecione um funil e digite o nome da etapa");
      return;
    }

    const updatedFunnels = funnels.map(funnel => {
      if (funnel.id === newStageFunnelId) {
        return {
          ...funnel,
          stages: [...funnel.stages, { id: crypto.randomUUID(), name: newStage }]
        };
      }
      return funnel;
    });

    setFunnels(updatedFunnels);
    setNewStage("");
    setNewStageFunnelId("");
    toast.success("Etapa criada com sucesso");
  };

  const handleSaveDefaultConfig = () => {
    if (!selectedFunnel || !selectedStage) {
      toast.error("Selecione um funil e uma etapa");
      return;
    }

    setIsDefaultConfigSaved(true);
    setIsEditing(false);
    toast.success("Configurações salvas com sucesso");
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return {
    funnels,
    selectedFunnel,
    selectedStage,
    newFunnel,
    newStage,
    newStageFunnelId,
    isDefaultConfigSaved,
    isEditing,
    setSelectedFunnel,
    setSelectedStage,
    setNewFunnel,
    setNewStage,
    setNewStageFunnelId,
    handleSaveFunnel,
    handleSaveStage,
    handleSaveDefaultConfig,
    handleToggleEdit,
  };
};
