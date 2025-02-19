
import { useState } from "react";
import { toast } from "sonner";

export const useFunnelManagement = () => {
  const [funnelName, setFunnelName] = useState("");
  const [stageName, setStageName] = useState("");
  const [isDefaultConfigSaved, setIsDefaultConfigSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveDefaultConfig = () => {
    if (!funnelName || !stageName) {
      toast.error("Preencha o nome do funil e da etapa");
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
    funnelName,
    stageName,
    isDefaultConfigSaved,
    isEditing,
    setFunnelName,
    setStageName,
    handleSaveDefaultConfig,
    handleToggleEdit,
  };
};
