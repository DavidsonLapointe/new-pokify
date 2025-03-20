
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { FunnelSection } from "@/components/settings/FunnelSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building2, Book } from "lucide-react";
import { CustomField } from "@/components/settings/types";
import { useFunnelManagement } from "@/hooks/settings/useFunnelManagement";
import { CompanyBriefingSection } from "@/components/settings/CompanyBriefingSection";

const OrganizationSettings = () => {
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [activeTab, setActiveTab] = useState("crm");
  
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Configure integrações e personalizações do sistema
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="crm" className="flex items-center gap-2">
            <Settings size={16} />
            CRM
          </TabsTrigger>
          <TabsTrigger value="briefing" className="flex items-center gap-2">
            <Book size={16} />
            Briefing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="crm" className="mt-4">
          <Card className="border border-gray-100">
            <div className="p-6 space-y-8">
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
          </Card>
        </TabsContent>
        
        <TabsContent value="briefing" className="mt-4">
          <Card className="border border-gray-100 shadow-sm">
            <div className="p-6">
              <CompanyBriefingSection />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationSettings;
