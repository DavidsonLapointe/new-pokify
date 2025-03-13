
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { FunnelSection } from "@/components/settings/FunnelSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { CustomField } from "@/components/settings/types";
import { useFunnelManagement } from "@/hooks/settings/useFunnelManagement";

const OrganizationSettings = () => {
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  
  // Use o hook para gerenciar o estado do funil
  const {
    funnelName,
    stageName,
    isDefaultConfigSaved,
    isEditing,
    setFunnelName,
    setStageName,
    handleSaveDefaultConfig,
    handleToggleEdit,
  } = useFunnelManagement();

  const handleOpenNewField = () => {
    // Implementar lógica para abrir modal de novo campo
    console.log("Open new field modal");
  };

  const handleOpenEditField = (field: CustomField) => {
    // Implementar lógica para abrir modal de edição
    console.log("Open edit field modal", field);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>
      <p className="text-muted-foreground">
        Configure integrações e personalizações do sistema
      </p>

      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <Tabs defaultValue="crm" className="space-y-4">
            <TabsList>
              <TabsTrigger value="crm">CRM</TabsTrigger>
            </TabsList>
            
            <TabsContent value="crm" className="space-y-8">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
