import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Package, 
  CreditCard, 
  Database, 
  MessageSquare, 
  Puzzle, 
  Quote, 
  PlusCircle,
  Pencil,
  Plus,
  Check,
  Mail,
  Users,
  Infinity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TestimonialsList } from "@/components/admin/testimonials/TestimonialsList";
import { EditTestimonialDialog } from "@/components/admin/testimonials/EditTestimonialDialog";
import { useTestimonials } from "@/hooks/admin/useTestimonials";
import { Testimonial } from "@/types/testimonial";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { fetchPlans } from "@/services/plans/planFetchService";
import { useQuery } from "@tanstack/react-query";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreatePackageForm } from "@/components/admin/packages/CreatePackageForm";
import { EditPackageForm } from "@/components/admin/packages/EditPackageForm";
import { PackagesList } from "@/components/admin/packages/PackagesList";
import { AnalysisPackage, NewPackageForm } from "@/types/packages";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleDialog } from "@/components/admin/modules/ModuleDialog";
import { LoadingState } from "@/components/admin/modules/LoadingState";
import { PageHeader } from "@/components/admin/modules/PageHeader";
import { ModuleCarousel } from "@/components/admin/modules/ModuleCarousel";
import { ModuleDetailsView } from "@/components/admin/modules/ModuleDetailsView";
import { CancelModuleDialog } from "@/components/admin/modules/CancelModuleDialog";
import { SetupContactDialog } from "@/components/admin/modules/SetupContactDialog";
import { useModulesManagement } from "@/components/admin/modules/hooks/useModulesManagement";
import { standardAreas } from "@/components/admin/modules/module-form-schema";

// Mocked packages data - same as in AdminAnalysisPackages.tsx
const mockedPackages: AnalysisPackage[] = [
  {
    id: "pkg-001",
    name: "Pacote Básico",
    credits: 50,
    price: 99.90,
    active: true,
    stripeProductId: "prod_mock_001",
    stripePriceId: "price_mock_001"
  },
  {
    id: "pkg-002",
    name: "Pacote Profissional",
    credits: 150,
    price: 249.90,
    active: true,
    stripeProductId: "prod_mock_002",
    stripePriceId: "price_mock_002"
  },
  {
    id: "pkg-003",
    name: "Pacote Empresarial",
    credits: 500,
    price: 699.90,
    active: true,
    stripeProductId: "prod_mock_003",
    stripePriceId: "price_mock_003"
  }
];

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

  // Modules state
  const [activeAreaFilter, setActiveAreaFilter] = useState<string | null>(null);
  
  const {
    modules,
    isLoading: modulesLoading,
    selectedModule,
    deletingModuleId,
    isCreateDialogOpen,
    editingModule,
    isCancelDialogOpen,
    cancelModuleId,
    isSetupContactDialogOpen,
    setupContactInfo,
    moduleGroups,
    setSelectedModule,
    setIsCreateDialogOpen,
    setEditingModule,
    setIsCancelDialogOpen,
    setCancelModuleId,
    setIsSetupContactDialogOpen,
    setSetupContactInfo,
    handleSaveModule,
    handleDeleteModule,
    handleEditModule,
    handleSelectModule
  } = useModulesManagement();

  // Update the active area filter and close any open module details
  const handleAreaFilterChange = (areaId: string | null) => {
    setActiveAreaFilter(areaId);
    if (selectedModule) {
      setSelectedModule(null);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelModuleId) {
      handleDeleteModule(cancelModuleId);
      setIsCancelDialogOpen(false);
    }
  };

  const handleContactInfoChange = (info: { name?: string; phone?: string }) => {
    setSetupContactInfo(prev => ({ ...prev, ...info }));
  };

  const handleSubmitContactInfo = () => {
    console.log("Informações de contato enviadas:", setupContactInfo);
    setIsSetupContactDialogOpen(false);
    // Aqui você pode adicionar a lógica para enviar as informações de contato
  };

  // Filter modules based on the active area filter
  const filteredModules = activeAreaFilter
    ? modules.filter(module => 
        Array.isArray(module.areas) && module.areas.includes(activeAreaFilter)
      )
    : modules;

  // Get module groups with filtered modules
  const getFilteredModuleGroups = () => {
    const groups = [];
    const groupSize = 4; // 4 cards per slide
    
    for (let i = 0; i < filteredModules.length; i += groupSize) {
      groups.push(filteredModules.slice(i, i + groupSize));
    }
    
    return groups;
  };

  // Get the name of the active area filter
  const getActiveAreaName = () => {
    const defaultAreas = standardAreas.filter(area => area.isDefault);
    return defaultAreas.find(a => a.id === activeAreaFilter)?.name || activeAreaFilter;
  };

  // Testimonials state
  const { 
    testimonials, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
  } = useTestimonials();
  
  const [open, setOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  // Plans state
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);
  const { toast: uiToast } = useToast();

  // Credit Packages state
  const [packages, setPackages] = useState<AnalysisPackage[]>(mockedPackages);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen2, setIsCreateDialogOpen2] = useState(false);
  const [newPackage, setNewPackage] = useState<NewPackageForm>({
    name: "",
    credits: "",
    price: ""
  });

  const { data: fetchedPlans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans
  });

  // Initialize local plans when data is loaded
  useEffect(() => {
    if (fetchedPlans) {
      setLocalPlans(fetchedPlans);
      console.log("Planos iniciais carregados:", fetchedPlans);
    }
  }, [fetchedPlans]);

  // Effect for loading packages simulation
  useEffect(() => {
    if (activeTab === 'pacotes-creditos') {
      // Just for visual demonstration, set a brief loading state
      setIsLoadingPackages(true);
      setTimeout(() => {
        setIsLoadingPackages(false);
      }, 1000);
    }
  }, [activeTab]);

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', value);
    window.history.pushState({}, '', newUrl.toString());
  };

  // Testimonials handlers
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setOpen(true);
  };

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setOpen(true);
  };

  const handleSaveTestimonial = (testimonial: Testimonial) => {
    if (editingTestimonial) {
      updateTestimonial(testimonial);
    } else {
      addTestimonial(testimonial);
    }
    setOpen(false);
  };

  const handleDeleteTestimonial = (id: string) => {
    deleteTestimonial(id);
  };

  // Plans handlers
  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(undefined);
    setEditPlanDialogOpen(true);
    console.log("Abrindo modal para criar novo plano");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setEditPlanDialogOpen(open);
    if (!open) {
      setSelectedPlan(undefined);
      console.log("Modal fechado, seleção de plano resetada");
    }
  };

  const handleSavePlan = async (updatedPlan: Partial<Plan>) => {
    try {
      // Se estamos editando um plano existente
      if (updatedPlan.id) {
        setLocalPlans(prevPlans => 
          prevPlans.map(p => p.id === updatedPlan.id ? { ...p, ...updatedPlan } as Plan : p)
        );
        console.log("Plano atualizado:", updatedPlan);
        uiToast({
          title: "Plano atualizado com sucesso",
          description: `O plano ${updatedPlan.name} foi atualizado.`
        });
      } 
      // Se estamos criando um novo plano
      else {
        // Criar um novo plano completo com ID
        const newPlan: Plan = { 
          ...updatedPlan as Plan,
          id: Date.now(), // Garantir um ID único baseado no timestamp
          benefits: Array.isArray(updatedPlan.benefits) 
            ? updatedPlan.benefits 
            : updatedPlan.benefits 
              ? (updatedPlan.benefits as string).split('\n').filter(b => b.trim()) 
              : []
        };
        
        console.log("Novo plano criado:", newPlan);
        
        // Atualizar o estado com o novo plano
        setLocalPlans(prevPlans => [...prevPlans, newPlan]);
        
        // Exibir toast de sucesso
        uiToast({
          title: "Plano criado com sucesso",
          description: `O plano ${newPlan.name} foi criado.`
        });
      }
      
      // Fechar o modal depois de salvar
      setEditPlanDialogOpen(false);
      
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      uiToast({
        title: "Erro ao salvar plano",
        description: "Ocorreu um erro ao salvar o plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Credit Package handlers
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emptyFields: string[] = [];
    
    if (!newPackage.name.trim()) {
      emptyFields.push("Nome do pacote");
    }
    if (!newPackage.credits) {
      emptyFields.push("Quantidade de créditos");
    }
    if (!newPackage.price) {
      emptyFields.push("Preço");
    }

    if (emptyFields.length > 0) {
      toast(`Por favor, preencha os seguintes campos: ${emptyFields.join(", ")}`);
      return;
    }

    const credits = parseInt(newPackage.credits);
    const price = parseFloat(newPackage.price);

    if (isNaN(credits) || credits <= 0) {
      toast(`A quantidade de créditos deve ser um número positivo`);
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast(`O preço deve ser um número positivo`);
      return;
    }

    toast.promise(
      // Promise to simulate API call
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // For demo, just add to local state
          const newId = `pkg-${Date.now().toString().slice(-3)}`;
          const newPkg: AnalysisPackage = {
            id: newId,
            name: newPackage.name,
            credits: credits,
            price: price,
            active: true,
            stripeProductId: `prod_mock_${newId}`,
            stripePriceId: `price_mock_${newId}`
          };
          
          setPackages([...packages, newPkg]);
          setNewPackage({ name: "", credits: "", price: "" });
          setIsCreateDialogOpen2(false);
          resolve();
        }, 1000);
      }),
      {
        loading: 'Criando pacote e cadastrando no Stripe...',
        success: 'Pacote criado com sucesso e registrado no Stripe',
        error: 'Ocorreu um erro ao criar o pacote'
      }
    );
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;

    toast.promise(
      // Promise to simulate API call
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // For demo, just update local state
          const updatedPackages = packages.map(pkg => 
            pkg.id === editingPackage.id ? editingPackage : pkg
          );
          setPackages(updatedPackages);
          setEditingPackage(null);
          setIsEditDialogOpen(false);
          resolve();
        }, 1000);
      }),
      {
        loading: 'Atualizando pacote e sincronizando com o Stripe...',
        success: 'Pacote atualizado com sucesso e sincronizado com o Stripe',
        error: 'Ocorreu um erro ao atualizar o pacote'
      }
    );
  };

  const handleToggleActive = async (pkg: AnalysisPackage, active: boolean) => {
    toast.promise(
      // Promise to simulate API call
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // For demo, just update local state
          const updatedPackages = packages.map(p => 
            p.id === pkg.id ? { ...p, active } : p
          );
          setPackages(updatedPackages);
          resolve();
        }, 1000);
      }),
      {
        loading: `${active ? 'Ativando' : 'Desativando'} pacote e atualizando no Stripe...`,
        success: `Pacote ${active ? 'ativado' : 'desativado'} com sucesso`,
        error: `Erro ao ${active ? 'ativar' : 'desativar'} pacote`
      }
    );
  };

  // Function to get the right icon based on benefit text
  const getBenefitIcon = (benefit: string) => {
    if (benefit.toLowerCase().includes('usuário') || benefit.toLowerCase().includes('usuários')) {
      return <Users className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    } else if (benefit.toLowerCase().includes('crédito') || benefit.toLowerCase().includes('créditos')) {
      return <CreditCard className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    } else if (benefit.toLowerCase().includes('integração') || benefit.toLowerCase().includes('crm')) {
      return <Database className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    } else if (benefit.toLowerCase().includes('suporte') || benefit.toLowerCase().includes('email')) {
      return <Mail className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
    }
    return <Check className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />;
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
              <CardTitle>Integrações</CardTitle>
              <div className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="modulos">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CardTitle className="text-left">Módulos</CardTitle>
                  <p className="text-muted-foreground">Gerencie as ferramentas de IA disponíveis no sistema</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Módulo
                </Button>
              </div>
              <CardContent className="p-0">
                <div className="container py-6 max-w-6xl mx-auto">
                  <PageHeader 
                    setIsCreateDialogOpen={setIsCreateDialogOpen}
                    activeAreaFilter={activeAreaFilter}
                    setActiveAreaFilter={handleAreaFilterChange}
                  />
                  
                  {modulesLoading ? (
                    <LoadingState />
                  ) : (
                    <ScrollArea className="w-full">
                      {activeAreaFilter && filteredModules.length === 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                          <p className="text-sm text-yellow-700">
                            Nenhum módulo encontrado para a área "{getActiveAreaName()}".
                          </p>
                        </div>
                      )}
                      
                      <ModuleCarousel
                        moduleGroups={activeAreaFilter ? getFilteredModuleGroups() : moduleGroups()}
                        selectedModule={selectedModule}
                        onEditModule={handleEditModule}
                        onSelectModule={handleSelectModule}
                      />
                      
                      {selectedModule && (
                        <ModuleDetailsView
                          selectedModule={selectedModule}
                          onEditModule={handleEditModule}
                          onDeleteModule={(id) => {
                            setIsCancelDialogOpen(true);
                            setEditingModule(null);
                            setCancelModuleId(id);
                          }}
                          deletingModuleId={deletingModuleId}
                        />
                      )}
                    </ScrollArea>
                  )}
                  
                  <ModuleDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    module={editingModule}
                    onSave={handleSaveModule}
                  />

                  <CancelModuleDialog
                    open={isCancelDialogOpen}
                    onOpenChange={setIsCancelDialogOpen}
                    modules={modules}
                    cancelModuleId={cancelModuleId}
                    onConfirm={handleConfirmCancel}
                  />

                  <SetupContactDialog
                    open={isSetupContactDialogOpen}
                    onOpenChange={setIsSetupContactDialogOpen}
                    setupContactInfo={setupContactInfo}
                    onContactInfoChange={handleContactInfoChange}
                    onSubmit={handleSubmitContactInfo}
                  />
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="pacotes-creditos">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CardTitle className="text-left">Pacotes de Créditos</CardTitle>
                  <p className="text-muted-foreground">
                    Gerencie os pacotes de créditos adicionais
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <div className="space-y-6">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <Dialog open={isCreateDialogOpen2} onOpenChange={setIsCreateDialogOpen2}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Novo Pacote
                          </CardTitle>
                          <CardDescription>
                            Crie um novo pacote de créditos para análises
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            onClick={() => setIsCreateDialogOpen2(true)} 
                            className="w-full"
                          >
                            Criar Pacote
                          </Button>
                        </CardContent>
                      </Card>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Novo Pacote de Créditos</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do novo pacote de créditos
                          </DialogDescription>
                        </DialogHeader>

                        <CreatePackageForm
                          newPackage={newPackage}
                          onSubmit={handleCreatePackage}
                          onChange={(field, value) => setNewPackage(prev => ({ ...prev, [field]: value }))}
                          onCancel={() => setIsCreateDialogOpen2(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Pacotes Disponíveis
                        </CardTitle>
                        <CardDescription>
                          Pacotes de créditos atualmente disponíveis para venda
                        </CardDescription>
                        <div className="mt-4 flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                          <Infinity className="h-4 w-4 text-primary shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            Os créditos adquiridos não expiram ao final do mês, ficando disponíveis até serem utilizados
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isLoadingPackages ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div 
                                key={i} 
                                className="p-4 border rounded-lg flex items-center justify-between animate-pulse"
                              >
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <PackagesList 
                            packages={packages}
                            onEdit={(pkg) => {
                              setEditingPackage(pkg);
                              setIsEditDialogOpen(true);
                            }}
                            onToggleActive={handleToggleActive}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Pacote</DialogTitle>
                    </DialogHeader>
                    {editingPackage && (
                      <EditPackageForm
                        package_={editingPackage}
                        onSubmit={handleUpdatePackage}
                        onChange={(field, value) => setEditingPackage(prev => ({ ...prev!, [field]: value }))}
                        onCancel={() => setIsEditDialogOpen(false)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
            
            <TabsContent value="planos">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CardTitle className="text-left">Planos</CardTitle>
                  <p className="text-muted-foreground">
                    Gerencie os planos disponíveis na plataforma
                  </p>
                </div>
                
                <Button onClick={handleCreatePlan} className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Plano
                </Button>
              </div>

              <div className="pt-4">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Gerencie os planos disponíveis na plataforma
                      </p>
                    </div>
                    
                    <Button onClick={handleCreatePlan} className="bg-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Plano
                    </Button>
                  </div>

                  {isLoading && localPlans.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[500px]">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : error && localPlans.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[500px]">
                      <p className="text-red-500">Erro ao carregar planos. Por favor, tente novamente.</p>
                    </div>
                  ) : localPlans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8">
                      <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum plano cadastrado</h3>
                      <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                        Crie seu primeiro plano para disponibilizar às organizações.
                      </p>
                      <Button onClick={handleCreatePlan} className="bg-purple-500 hover:bg-purple-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Plano
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {localPlans.map((plan) => (
                        <div key={plan.id} className="border rounded-lg shadow-sm overflow-hidden flex flex-col">
                          <div className="p-4 pt-6 flex-grow flex flex-col">
                            {/* Coloca o nome do plano e o preço em elementos separados, um abaixo do outro */}
                            <div className="flex flex-col mb-2">
                              <h3 className="text-xl font-semibold">{plan.name}</h3>
                              <div className="text-purple-500 font-medium mt-1">
                                R$ {plan.price.toFixed(2)}<span className="text-sm text-gray-500">/mês</span>
                              </div>
                            </div>
                            
                            {/* Descrição com altura fixa para garantir alinhamento entre os cards */}
                            <div className="h-12 mb-6">
                              <p className="text-sm text-gray-500">
                                {plan.shortDescription}
                              </p>
                            </div>
                            
                            {/* Container para créditos com altura fixa e centralizado */}
                            <div className="h-16 flex items-center justify-center mb-6">
                              {plan.credits && (
                                <div className="bg-gray-100 rounded-md p-3 w-full flex items-center justify-center">
                                  <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                                  <span className="text-sm">{plan.credits} créditos mensais</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Container para recursos inclusos com altura fixa para garantir alinhamento */}
                            <div className="mb-4">
                              <div className="h-10 flex items-center">
                                <h4 className="font-medium text-sm text-gray-600">Recursos inclusos:</h4>
                              </div>
                              <Separator className="mb-4" />
                              <ul className="space-y-2">
                                {plan.benefits && Array.isArray(plan.benefits) && plan.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start text-sm text-gray-600 text-left">
                                    <div className="h-5 w-5 bg-purple-100 flex items-center justify-center flex-shrink-0 mr-2 rounded-full">
                                      <Check className="h-3 w-3 text-purple-500" />
                                    </div>
                                    <span className="text-left">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Spacer flexível para empurrar o botão para o final do card */}
                            <div className="flex-grow min-h-[20px]"></div>
                            
                            {/* Container do botão com altura fixa para garantir alinhamento entre os cards */}
                            <div className="h-12 flex items-center mt-4">
                              <Button 
                                onClick={() => handleEditPlan(plan)} 
                                className="w-full bg-purple-500 hover:bg-purple-600"
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar Plano
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <EditPlanDialog
                    open={editPlanDialogOpen}
                    onOpenChange={handleDialogOpenChange}
                    plan={selectedPlan}
                    onSave={handleSavePlan}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="prompts">
              <CardTitle>Prompts</CardTitle>
              <div className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="depoimentos">
              <CardTitle>Depoimentos</CardTitle>
              <div className="pt-4">
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground">
                      Gerencie os depoimentos exibidos na página inicial do site.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleAddTestimonial}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Depoimento
                    </Button>
                  </div>

                  <TestimonialsList 
                    testimonials={testimonials}
                    onEdit={handleEditTestimonial}
                    onDelete={handleDeleteTestimonial}
                  />

                  <EditTestimonialDialog
                    open={open}
                    onOpenChange={setOpen}
                    testimonial={editingTestimonial}
                    onSave={handleSaveTestimonial}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationsTwo;
