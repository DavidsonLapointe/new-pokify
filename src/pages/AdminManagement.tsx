
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect } from "react";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import FinancialHeader from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";
import { useFinancialFilters } from "@/components/admin/financial/hooks/useFinancialFilters";
import { getAllTitles } from "@/services/financial";
import { useQuery } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleSetupsList } from "@/components/admin/modules/ModuleSetupsList";
import { SetupStatus } from "@/components/organization/modules/types";
import { toast } from "sonner";
import { LeadsTab } from "@/components/admin/registrations/tabs/LeadsTab";

const AdminManagement = () => {
  // Use React Query para buscar títulos com refetch ativado
  const { data: fetchedTitles, isLoading: financialLoading, refetch } = useQuery({
    queryKey: ['financial-titles'],
    queryFn: getAllTitles,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  // Use nosso hook personalizado para filtragem
  const { filteredTitles, filters, applyFilters, clearFilters } = useFinancialFilters(fetchedTitles || []);

  // Garantir que os títulos sejam exibidos no carregamento inicial
  useEffect(() => {
    if (fetchedTitles && fetchedTitles.length > 0) {
      // Inicializar com todos os títulos, sem aplicar filtros
      applyFilters({ status: "all", type: "all", search: "" }, false);
    }
  }, [fetchedTitles, applyFilters]);

  const handleSearch = (filters: { 
    status: "pending" | "paid" | "overdue" | "all", 
    type: "pro_rata" | "mensalidade" | "setup" | "all", 
    search: string 
  }) => {
    applyFilters(filters);
  };

  // Handler para quando o status de um setup é alterado
  const handleSetupStatusChange = (
    setupId: string, 
    moduleId: string, 
    organizationId: string, 
    newStatus: SetupStatus
  ) => {
    console.log(`Setup ${setupId} para o módulo ${moduleId} da organização ${organizationId} foi atualizado para ${newStatus}`);
    
    // Here you could add logic to update global state or make an API call
    // When status is "completed", this should change the module status to "contracted" for the organization
    if (newStatus === "completed") {
      toast.success(`O módulo ${moduleId} foi configurado e agora está disponível para a organização ${organizationId}`);
      // In a real environment, this would be done through an API
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestão</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CardHeader>
          <Tabs defaultValue="custo-de-ia" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="custo-de-ia">Custo de IA</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="funcoes-sem-usuarios">Funções sem Usuários</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="setups">Setups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="custo-de-ia">
              <CardTitle>Gestão - Custo de IA</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="financeiro">
              <CardContent className="p-0 pt-4">
                <div className="space-y-6">
                  <FinancialHeader />
                  {financialLoading ? (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <FinancialFilters onSearch={handleSearch} initialFilters={filters} />
                      <FinancialTitlesTable titles={filteredTitles} />
                    </>
                  )}
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="funcoes-sem-usuarios">
              <CardTitle>Gestão - Funções sem Usuários</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="leads">
              <CardTitle>Gestão - Leads</CardTitle>
              <CardContent className="pt-4">
                <LeadsTab />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="setups">
              <CardTitle>Gestão - Setups</CardTitle>
              <CardContent className="pt-4 p-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground mb-6">Lista de Implantações Pendentes e em Andamento</p>
                </div>
                <TooltipProvider>
                  <ModuleSetupsList onStatusChange={handleSetupStatusChange} />
                </TooltipProvider>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </div>
    </div>
  );
};

export default AdminManagement;
