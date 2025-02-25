
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { FunnelSection } from "@/components/settings/FunnelSection";

import { CustomField } from "@/components/settings/types";

const OrganizationSettings = () => {
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleOpenNewField = () => {
    // Implementar lógica para abrir modal de novo campo
    console.log("Open new field modal");
  };

  const handleOpenEditField = (field: CustomField) => {
    // Implementar lógica para abrir modal de edição
    console.log("Open edit field modal", field);
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
        <CardContent className="p-6 space-y-6">
          <Tabs defaultValue="funnel" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="funnel">Funil de Vendas</TabsTrigger>
              <TabsTrigger value="fields">Campos Personalizados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="funnel">
              <FunnelSection />
            </TabsContent>
            
            <TabsContent value="fields">
              <CustomFieldsSection
                customFields={customFields}
                handleOpenNewField={handleOpenNewField}
                handleOpenEditField={handleOpenEditField}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
