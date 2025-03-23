
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  RegistrationTwoTabValue, 
  getTabComponent, 
  getAvailableTabs 
} from "@/utils/registrationTabs";

const AdminRegistrationsTwo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RegistrationTwoTabValue>("empresas");
  
  // Parse the tab from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    if (tabParam && isValidTab(tabParam)) {
      setActiveTab(tabParam as RegistrationTwoTabValue);
    }
  }, [location.search]);
  
  // Check if the tab value is valid
  const isValidTab = (tab: string): boolean => {
    return getAvailableTabs().some(t => t.value === tab);
  };
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    if (isValidTab(value)) {
      setActiveTab(value as RegistrationTwoTabValue);
      navigate(`?tab=${value}`, { replace: true });
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Cadastros</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os cadastros do sistema
        </p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6 flex flex-wrap gap-1">
          {getAvailableTabs().map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {getAvailableTabs().map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {getTabComponent(tab.value as RegistrationTwoTabValue)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminRegistrationsTwo;
