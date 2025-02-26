
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { FunnelSection } from "@/components/settings/FunnelSection";

import { CustomField } from "@/components/settings/types";

const OrganizationSettings = () => {
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  
  // Add state for funnel configuration
  const [funnelName, setFunnelName] = useState("");
  const [stageName, setStageName] = useState("");
  const [isDefaultConfigSaved, setIsDefaultConfigSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenNewField = () => {
    // Implementar lógica para abrir modal de novo campo
    console.log("Open new field modal");
  };

  const handleOpenEditField = (field: CustomField) => {
    // Implementar lógica para abrir modal de edição
    console.log("Open edit field modal", field);
  };

  const handleSaveDefaultConfig = () => {
    if (!funnelName || !stageName) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    setIsDefaultConfigSaved(true);
    setIsEditing(false);
    toast({
      title: "Sucesso",
      description: "Configurações do funil salvas com sucesso",
    });
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">
            Configurações do Sistema
          </CardTitle>
          <CardDescription>
            Configure o funil de vendas e campos personalizados para extração de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-8">
            <FunnelSection
              funnelName={funnelName}
              stageName={stageName}
              setFunnelName={setFunnelName}
              setStageName={setStageName}
              isDefaultConfigSaved={isDefaultConfigSaved}
              isEditing={isEditing}
              onSaveDefaultConfig={handleSaveDefaultConfig}
              onToggleEdit={handleToggleEdit}
            />
            
            <CustomFieldsSection
              customFields={customFields}
              handleOpenNewField={handleOpenNewField}
              handleOpenEditField={handleOpenEditField}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
