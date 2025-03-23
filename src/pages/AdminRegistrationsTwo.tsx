
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Package, 
  CreditCard, 
  Database, 
  MessageSquare, 
  Puzzle, 
  Quote
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import tab components
import { IntegrationsTab } from "@/components/admin/registrations-two/tabs/IntegrationsTab";
import { ModulesTab } from "@/components/admin/registrations-two/tabs/ModulesTab";
import { CreditPackagesTab } from "@/components/admin/registrations-two/tabs/CreditPackagesTab";
import { PlansTab } from "@/components/admin/registrations-two/tabs/PlansTab";
import { PromptsTab } from "@/components/admin/registrations-two/tabs/PromptsTab";
import { TestimonialsTab } from "@/components/admin/registrations-two/tabs/TestimonialsTab";

const AdminRegistrationsTwo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get('tab');
  
  // Set the default tab based on URL query parameter
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === 'planos' ? 'planos' : 
    tabFromUrl === 'depoimentos' ? 'depoimentos' : 
    tabFromUrl === 'integracoes' ? 'integracoes' : 
    tabFromUrl === 'modulos' ? 'modulos' : 
    tabFromUrl === 'pacotes-creditos' ? 'pacotes-creditos' : 
    tabFromUrl === 'prompts' ? 'prompts' : 
    'depoimentos' // Default tab if no valid tab is specified
  );

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', value);
    window.history.pushState({}, '', newUrl.toString());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastros 2</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="integracoes">
                <Database className="w-4 h-4 mr-2" />
                Integrações
              </TabsTrigger>
              <TabsTrigger value="modulos">
                <Puzzle className="w-4 h-4 mr-2" />
                Módulos
              </TabsTrigger>
              <TabsTrigger value="pacotes-creditos">
                <Package className="w-4 h-4 mr-2" />
                Pacotes de Créditos
              </TabsTrigger>
              <TabsTrigger value="planos">
                <CreditCard className="w-4 h-4 mr-2" />
                Planos
              </TabsTrigger>
              <TabsTrigger value="prompts">
                <MessageSquare className="w-4 h-4 mr-2" />
                Prompts
              </TabsTrigger>
              <TabsTrigger value="depoimentos">
                <Quote className="w-4 h-4 mr-2" />
                Depoimentos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="integracoes">
              <IntegrationsTab />
            </TabsContent>
            
            <TabsContent value="modulos">
              <ModulesTab />
            </TabsContent>
            
            <TabsContent value="pacotes-creditos">
              <CreditPackagesTab />
            </TabsContent>
            
            <TabsContent value="planos">
              <PlansTab />
            </TabsContent>
            
            <TabsContent value="prompts">
              <PromptsTab />
            </TabsContent>
            
            <TabsContent value="depoimentos">
              <TestimonialsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationsTwo;
