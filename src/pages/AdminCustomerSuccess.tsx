import { useState } from "react";
import { Organization } from "@/types";
import { OrganizationSelector } from "@/components/admin/customer-success/OrganizationSelector";
import { OrganizationOverview } from "@/components/admin/customer-success/OrganizationOverview";
import { UsersStatistics } from "@/components/admin/customer-success/UsersStatistics";
import { AIExecutionsChart } from "@/components/admin/customer-success/AIExecutionsChart";
import { UserLogsList } from "@/components/admin/customer-success/UserLogsList";
import { ModulesStatus } from "@/components/admin/customer-success/ModulesStatus";
import { UsersByPermission } from "@/components/admin/customer-success/UsersByPermission";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { NotesDialog } from "@/components/admin/customer-success/notes/NotesDialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users,
  Building,
  MessageSquare,
  BarChart3,
  ClipboardCheck,
  Calendar,
  CreditCard,
  ShieldAlert,
  Info
} from "lucide-react";
import { CustomerSuccessStatCard } from "@/components/admin/customer-success/CustomerSuccessStatCard";
import { InactiveOrgsModal } from "@/components/admin/customer-success/InactiveOrgsModal";
import { LowCreditsOrgsModal } from "@/components/admin/customer-success/LowCreditsOrgsModal";
import { UnusedPermissionsModal } from "@/components/admin/customer-success/UnusedPermissionsModal";
import { CustomerSuccessMetricsChart } from "@/components/admin/customer-success/CustomerSuccessMetricsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

// Mock data for demonstration
const mockInactiveOrgs = [
  {
    id: "1",
    name: "TechSolutions Brasil",
    adminName: "João Silva",
    adminEmail: "joao.silva@techsolutions.com.br",
    adminPhone: "(11) 98765-4321",
    lastAccessDate: "2023-11-10T14:30:00Z",
    lastAccessUser: "Maria Oliveira"
  },
  {
    id: "2",
    name: "Conecta Software",
    adminName: "Ana Santos",
    adminEmail: "ana@conectasoftware.com.br",
    adminPhone: "(21) 97654-3210",
    lastAccessDate: "2023-11-08T09:15:00Z",
    lastAccessUser: "Carlos Pereira"
  },
  {
    id: "3",
    name: "DataSoft Tecnologia",
    adminName: "Roberto Lima",
    adminEmail: "roberto@datasoft.com.br",
    adminPhone: "(31) 96543-2109",
    lastAccessDate: "2023-11-05T16:45:00Z",
    lastAccessUser: "Patricia Mendes"
  }
];

const mockLowCreditsOrgs = [
  {
    id: "1",
    name: "TechSolutions Brasil",
    adminName: "João Silva",
    adminEmail: "joao.silva@techsolutions.com.br",
    adminPhone: "(11) 98765-4321",
    remainingCredits: 32,
    lastAccessDate: "2023-11-15T14:30:00Z",
    lastAccessUser: "Maria Oliveira"
  },
  {
    id: "2",
    name: "Conecta Software",
    adminName: "Ana Santos",
    adminEmail: "ana@conectasoftware.com.br",
    adminPhone: "(21) 97654-3210",
    remainingCredits: 18,
    lastAccessDate: "2023-11-16T09:15:00Z",
    lastAccessUser: "Carlos Pereira"
  },
  {
    id: "3",
    name: "InnovateTech",
    adminName: "Paulo Martins",
    adminEmail: "paulo@innovatetech.com.br",
    adminPhone: "(41) 95432-1098",
    remainingCredits: 5,
    lastAccessDate: "2023-11-17T11:20:00Z",
    lastAccessUser: "Paulo Martins"
  },
  {
    id: "4",
    name: "DataSoft Tecnologia",
    adminName: "Roberto Lima",
    adminEmail: "roberto@datasoft.com.br",
    adminPhone: "(31) 96543-2109",
    remainingCredits: 47,
    lastAccessDate: "2023-11-15T16:45:00Z",
    lastAccessUser: "Patricia Mendes"
  }
];

const mockUnusedPermissionsOrgs = [
  {
    id: "1",
    name: "TechSolutions Brasil",
    adminName: "João Silva",
    adminEmail: "joao.silva@techsolutions.com.br",
    adminPhone: "(11) 98765-4321",
    unusedPermissions: ["Dashboard Financeiro", "CRM Avançado", "Relatórios"]
  },
  {
    id: "2",
    name: "Conecta Software",
    adminName: "Ana Santos",
    adminEmail: "ana@conectasoftware.com.br",
    adminPhone: "(21) 97654-3210",
    unusedPermissions: ["Configurações Avançadas", "Análise de Dados"]
  },
  {
    id: "3",
    name: "DataSoft Tecnologia",
    adminName: "Roberto Lima",
    adminEmail: "roberto@datasoft.com.br",
    adminPhone: "(31) 96543-2109",
    unusedPermissions: ["Integração de APIs", "Gestão de Equipes", "Automações"]
  },
  {
    id: "4",
    name: "ByteCode Systems",
    adminName: "Lucia Ferreira",
    adminEmail: "lucia@bytecode.com.br",
    adminPhone: "(47) 98521-3647",
    unusedPermissions: ["Módulo de Vendas", "Painel Administrativo"]
  },
  {
    id: "5",
    name: "SoftWay Tecnologia",
    adminName: "Marcelo Santos",
    adminEmail: "marcelo@softway.com.br",
    adminPhone: "(19) 99876-5432",
    unusedPermissions: ["Gestão de Campanhas", "Relatórios Personalizados"]
  },
  {
    id: "6",
    name: "CloudTech Solutions",
    adminName: "Fernanda Lima",
    adminEmail: "fernanda@cloudtech.com.br",
    adminPhone: "(85) 98765-1234",
    unusedPermissions: ["Configurações de Sistema", "Gestão de Leads"]
  },
  {
    id: "7",
    name: "NeoSoft",
    adminName: "Ricardo Oliveira",
    adminEmail: "ricardo@neosoft.com.br",
    adminPhone: "(48) 99632-8521",
    unusedPermissions: ["Ferramentas de BI", "Controle de Acesso"]
  },
  {
    id: "8",
    name: "Inovação Digital",
    adminName: "Carolina Pereira",
    adminEmail: "carolina@inovacaodigital.com.br",
    adminPhone: "(71) 98523-6974",
    unusedPermissions: ["Monitoramento de Performance", "Dashboard Analítico"]
  },
  {
    id: "9",
    name: "WebTech Brasil",
    adminName: "Gustavo Souza",
    adminEmail: "gustavo@webtech.com.br",
    adminPhone: "(62) 99874-3216",
    unusedPermissions: ["Automação de Marketing", "Análise de Tendências"]
  },
  {
    id: "10",
    name: "DataLogic Soluções",
    adminName: "Amanda Rocha",
    adminEmail: "amanda@datalogic.com.br",
    adminPhone: "(81) 98756-4123",
    unusedPermissions: ["Relatórios Avançados", "Gestão de Usuários"]
  },
  {
    id: "11",
    name: "SolutionTech",
    adminName: "Bruno Mendez",
    adminEmail: "bruno@solutiontech.com.br",
    adminPhone: "(51) 99865-7412",
    unusedPermissions: ["Painel Financeiro", "Módulo Administrativo"]
  },
  {
    id: "12",
    name: "TechFusion",
    adminName: "Juliana Castro",
    adminEmail: "juliana@techfusion.com.br",
    adminPhone: "(27) 98754-3691",
    unusedPermissions: ["Gestão de Projetos", "Analytics"]
  }
];

const AdminCustomerSuccess = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  // Define the metric type to match the expected union type
  const [selectedMetric, setSelectedMetric] = useState<"active-companies" | "active-users" | "ai-executions" | "ai-tools-per-client">("active-companies");
  
  // State for modals
  const [isInactiveOrgsModalOpen, setIsInactiveOrgsModalOpen] = useState(false);
  const [isLowCreditsModalOpen, setIsLowCreditsModalOpen] = useState(false);
  const [isUnusedPermissionsModalOpen, setIsUnusedPermissionsModalOpen] = useState(false);

  const handleOrganizationChange = (organization: Organization | null) => {
    setLoading(true);
    // Simulate loading time to show skeleton
    setTimeout(() => {
      setSelectedOrganization(organization);
      setLoading(false);
      // Reset search term when an organization is selected
      setSearchTerm("");
    }, 800);
  };

  const handleOpenNotes = () => {
    if (selectedOrganization) {
      setIsNotesDialogOpen(true);
    } else {
      toast.error("Selecione uma empresa primeiro");
    }
  };

  const handleAddNote = (organizationId: string, content: string) => {
    const newNote: CustomerNote = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      userName: "Usuário atual" // Ideally, get this from the auth context
    };
    
    setCustomerNotes(prev => [...prev, newNote]);
    toast.success("Anotação adicionada com sucesso!");
  };

  const handleEditNote = (organizationId: string, noteId: string, newContent: string) => {
    setCustomerNotes(prev => 
      prev.map(note => note.id === noteId ? { ...note, content: newContent } : note)
    );
    toast.success("Anotação atualizada com sucesso!");
  };

  const handleDeleteNote = (organizationId: string, noteId: string) => {
    setCustomerNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success("Anotação excluída com sucesso!");
  };

  // Get the metric label based on the selected value
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "active-companies":
        return "Crescimento de empresas clientes ativas";
      case "active-users":
        return "Crescimento de usuários Ativos";
      case "ai-executions":
        return "Qtde de execuções de ferramentas de IA";
      case "ai-tools-per-client":
        return "Média de contratação de ferramentas de IA por cliente";
      default:
        return "Crescimento de empresas clientes ativas";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold">Customer Success</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie o sucesso dos clientes Leadly
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="dashboard" className="flex-1">Dashboard Customer Success</TabsTrigger>
          <TabsTrigger value="company-analysis" className="flex-1">Análise por Empresa</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomerSuccessStatCard
              title="Setups Pendentes/Em Andamento"
              value={12}
              icon={ClipboardCheck}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-500"
              tooltip="Empresas com processos de setup em andamento ou pendentes de finalização"
            />
            
            <CustomerSuccessStatCard
              title="Empresas Sem Acesso (>5 dias)"
              value={3}
              icon={Calendar}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-500"
              onClick={() => setIsInactiveOrgsModalOpen(true)}
              tooltip="Empresas onde nenhum usuário fez login nos últimos 5 dias"
              buttonLabel="Ver empresas"
            />
            
            <CustomerSuccessStatCard
              title="Empresas com menos de 50 créditos"
              value={4}
              icon={CreditCard}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-500"
              onClick={() => setIsLowCreditsModalOpen(true)}
              tooltip="Empresas com saldo de créditos inferior a 50 unidades"
              buttonLabel="Ver empresas"
            />
            
            <CustomerSuccessStatCard
              title="Funções/Abas sem usuários"
              value={12}
              icon={ShieldAlert}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-500"
              onClick={() => setIsUnusedPermissionsModalOpen(true)}
              tooltip="Empresas que possuem funções ou abas configuradas mas sem usuários com acesso"
              buttonLabel="Ver empresas"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomerSuccessStatCard
              title="Total de Empresas"
              value={48}
              icon={Building}
              iconBgColor="bg-indigo-100"
              iconColor="text-indigo-600"
              bottomText="+12% no último mês"
            />
            
            <CustomerSuccessStatCard
              title="Usuários Ativos"
              value={345}
              icon={Users}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              bottomText="+8% no último mês"
            />
            
            <CustomerSuccessStatCard
              title="Interações"
              value="1.249"
              icon={MessageSquare}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              bottomText="+23% no último mês"
            />
            
            <CustomerSuccessStatCard
              title="Taxa de Retenção"
              value="92%"
              icon={ClipboardCheck}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-600"
              bottomText="+2% no último mês"
            />
          </div>
          
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>{getMetricLabel()}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Valores baseados na posição de fechamento de cada mês
                  </p>
                </div>
                <Select
                  value={selectedMetric}
                  onValueChange={(value: string) => {
                    // Add type assertion to ensure the value is of the correct type
                    setSelectedMetric(value as "active-companies" | "active-users" | "ai-executions" | "ai-tools-per-client");
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Selecione a métrica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active-companies">Crescimento de empresas clientes ativas</SelectItem>
                    <SelectItem value="active-users">Crescimento de usuários Ativos</SelectItem>
                    <SelectItem value="ai-executions">Qtde de execuções de ferramentas de IA</SelectItem>
                    <SelectItem value="ai-tools-per-client">Média de contratação de ferramentas de IA por cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <div className="h-[350px]">
                <CustomerSuccessMetricsChart metricType={selectedMetric} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Empresas com Maior Atividade</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Empresa</th>
                    <th className="text-left py-3 px-4">Usuários Ativos</th>
                    <th className="text-left py-3 px-4">Interações</th>
                    <th className="text-left py-3 px-4">Módulos</th>
                    <th className="text-left py-3 px-4">Última Atividade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">TechSolutions Brasil</td>
                    <td className="py-3 px-4">24</td>
                    <td className="py-3 px-4">187</td>
                    <td className="py-3 px-4">4</td>
                    <td className="py-3 px-4">Hoje</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">GloboTech</td>
                    <td className="py-3 px-4">18</td>
                    <td className="py-3 px-4">143</td>
                    <td className="py-3 px-4">3</td>
                    <td className="py-3 px-4">Hoje</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">Conecta Software</td>
                    <td className="py-3 px-4">15</td>
                    <td className="py-3 px-4">112</td>
                    <td className="py-3 px-4">3</td>
                    <td className="py-3 px-4">Ontem</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">Sistemas Integrados SA</td>
                    <td className="py-3 px-4">12</td>
                    <td className="py-3 px-4">98</td>
                    <td className="py-3 px-4">2</td>
                    <td className="py-3 px-4">Ontem</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-3 px-4">DataSoft</td>
                    <td className="py-3 px-4">10</td>
                    <td className="py-3 px-4">87</td>
                    <td className="py-3 px-4">3</td>
                    <td className="py-3 px-4">Há 2 dias</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="company-analysis" className="space-y-6">
          <div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-left">
                  Selecione uma empresa para analisar
                </label>
                <div className="w-full max-w-3xl relative">
                  <OrganizationsSearch value={searchTerm} onChange={setSearchTerm} />
                  <OrganizationSelector 
                    onOrganizationChange={handleOrganizationChange}
                    searchTerm={searchTerm}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="w-full h-48 rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="w-full h-72 rounded-lg" />
                <Skeleton className="w-full h-72 rounded-lg" />
              </div>
              <Skeleton className="w-full h-72 rounded-lg" />
              <Skeleton className="w-full h-64 rounded-lg" />
            </div>
          ) : selectedOrganization ? (
            <div className="space-y-6">
              <OrganizationOverview 
                organization={selectedOrganization} 
                onOpenNotes={handleOpenNotes}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ModulesStatus organizationId={selectedOrganization.id} />
                </div>

                <div>
                  <UsersStatistics 
                    users={selectedOrganization.users || []} 
                    organizationName={selectedOrganization.name}
                  />
                  
                  <div className="mt-6">
                    <UsersByPermission
                      users={selectedOrganization.users || []}
                      organizationName={selectedOrganization.name}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="w-full">
                  <AIExecutionsChart organizationId={selectedOrganization.id} />
                </div>
              </div>

              <div className="w-full">
                <UserLogsList organizationId={selectedOrganization.id} />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-lg">
              <p className="text-lg text-gray-500">
                Selecione uma empresa para visualizar suas informações
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <InactiveOrgsModal 
        isOpen={isInactiveOrgsModalOpen} 
        onOpenChange={setIsInactiveOrgsModalOpen}
        inactiveOrgs={mockInactiveOrgs}
      />
      
      <LowCreditsOrgsModal 
        isOpen={isLowCreditsModalOpen} 
        onOpenChange={setIsLowCreditsModalOpen}
        lowCreditsOrgs={mockLowCreditsOrgs}
      />
      
      <UnusedPermissionsModal 
        isOpen={isUnusedPermissionsModalOpen} 
        onOpenChange={setIsUnusedPermissionsModalOpen}
        unusedPermissionsOrgs={mockUnusedPermissionsOrgs}
      />

      {selectedOrganization && (
        <NotesDialog
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          moduleName={selectedOrganization.name}
          moduleId={selectedOrganization.id}
          notes={customerNotes}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
};

export default AdminCustomerSuccess;
