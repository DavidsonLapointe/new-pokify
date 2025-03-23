
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AverageCostTab from "@/components/admin/ai-costs/AverageCostTab";
import { mockAverageCostData } from "@/components/admin/ai-costs/utils";
import { LeadsPagination } from "@/components/admin/leads/LeadsPagination";

const AdminManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("custo-de-ia");
  const [aiCostSubTab, setAiCostSubTab] = useState("custo-medio");
  const [searchTerm, setSearchTerm] = useState("");
  const [toolFilter, setToolFilter] = useState("");
  
  // Pagination state for AI executions
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(location.search);
    params.set('tab', value);
    navigate(`?${params.toString()}`);
  };

  // Use React Query para buscar títulos com refetch ativado
  const { data: fetchedTitles, isLoading: financialLoading, refetch } = useQuery({
    queryKey: ['financial-titles'],
    queryFn: getAllTitles,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  // Fetch AI executions data
  const { data: aiExecutions, isLoading: aiCostsLoading } = useQuery({
    queryKey: ['ai-executions-table'],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return mockAverageCostData.slice(0, 20); // Take just a sample for the detailed table
    }
  });

  // Get unique tool names for filter
  const uniqueToolNames = aiExecutions ? [...new Set(aiExecutions.map(execution => execution.toolName))] : [];

  // Filter executions based on search term and tool
  const filteredExecutions = aiExecutions?.filter(execution => {
    const matchesSearch = searchTerm === "" || 
      execution.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTool = toolFilter === "" || toolFilter === "all" || 
      execution.toolName === toolFilter;
    
    return matchesSearch && matchesTool;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExecutions = filteredExecutions?.slice(indexOfFirstItem, indexOfLastItem);
  const totalExecutions = filteredExecutions?.length || 0;

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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="custo-de-ia">Custo de IA</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="funcoes-sem-usuarios">Funções sem Usuários</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="setups">Setups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="custo-de-ia">
              <CardTitle className="text-left">Custo de IA</CardTitle>
              <CardContent className="pt-4 space-y-6">
                {/* Custo de IA Tabs */}
                <Tabs value={aiCostSubTab} onValueChange={setAiCostSubTab} className="space-y-4">
                  <TabsList className="w-full max-w-md">
                    <TabsTrigger value="custo-medio" className="flex-1">Custo Médio</TabsTrigger>
                    <TabsTrigger value="analytic-report" className="flex-1">Relatório Analítico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="custo-medio" className="space-y-4">
                    <AverageCostTab />
                  </TabsContent>

                  <TabsContent value="analytic-report" className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <Label htmlFor="search" className="mb-2">Buscar</Label>
                        <Input
                          id="search"
                          placeholder="Buscar por empresa ou CNPJ..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="w-full sm:w-72">
                        <Label htmlFor="tool" className="mb-2">Ferramenta de IA</Label>
                        <Select
                          value={toolFilter}
                          onValueChange={setToolFilter}
                        >
                          <SelectTrigger id="tool">
                            <SelectValue placeholder="Todas as ferramentas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as ferramentas</SelectItem>
                            {uniqueToolNames.map((tool) => (
                              <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="cancel"
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSearchTerm("");
                            setToolFilter("");
                            setCurrentPage(1); // Reset to first page when filters change
                          }}
                        >
                          <FilterX className="h-4 w-4" />
                          Limpar Filtros
                        </Button>
                      </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-lg border shadow-sm">
                      <TooltipProvider>
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-medium">Ferramenta de IA</th>
                              <th className="text-left p-3 font-medium">Data e Hora</th>
                              <th className="text-right p-3 font-medium">Custo Total</th>
                              <th className="text-left p-3 font-medium">Empresa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aiCostsLoading ? (
                              // Loading state
                              Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b">
                                  <td className="p-3"><div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div></td>
                                  <td className="p-3"><div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div></td>
                                  <td className="p-3 text-right"><div className="h-6 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                                  <td className="p-3"><div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div></td>
                                </tr>
                              ))
                            ) : filteredExecutions?.length === 0 ? (
                              // Empty state
                              <tr>
                                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                                  Nenhuma execução de IA encontrada com os filtros atuais
                                </td>
                              </tr>
                            ) : (
                              // Data rows
                              currentExecutions?.map((execution) => (
                                <tr key={execution.id} className="border-b">
                                  <td className="p-3 font-medium text-foreground">
                                    {execution.toolName}
                                  </td>
                                  <td className="p-3">
                                    {new Date(execution.executionDate).toLocaleDateString('pt-BR')} às {new Date(execution.executionDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                  </td>
                                  <td className="p-3 text-right font-medium">
                                    ${execution.totalCost.toFixed(4)}
                                  </td>
                                  <td className="p-3">{execution.organizationName}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </TooltipProvider>
                    </div>
                    
                    {/* Pagination */}
                    {filteredExecutions && filteredExecutions.length > 0 && (
                      <LeadsPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalExecutions}
                        itemsPerPage={itemsPerPage}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="financeiro">
              <CardTitle>Financeiro</CardTitle>
              <CardContent className="pt-4">
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
              <CardTitle>Funções sem Usuários</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="leads">
              <CardTitle>Leads</CardTitle>
              <CardContent className="pt-4">
                <LeadsTab />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="setups">
              <CardTitle>Setups</CardTitle>
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
