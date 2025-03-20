
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
import { Card } from "@/components/ui/card";
import { 
  Users,
  Building,
  MessageSquare,
  BarChart3,
  ClipboardCheck
} from "lucide-react";

interface CustomerNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

const AdminCustomerSuccess = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

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
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Total de Empresas</h3>
              <p className="text-3xl font-bold mt-2">48</p>
              <p className="text-sm text-muted-foreground mt-2">+12% no último mês</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Usuários Ativos</h3>
              <p className="text-3xl font-bold mt-2">345</p>
              <p className="text-sm text-muted-foreground mt-2">+8% no último mês</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Interações</h3>
              <p className="text-3xl font-bold mt-2">1.249</p>
              <p className="text-sm text-muted-foreground mt-2">+23% no último mês</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <ClipboardCheck className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium">Taxa de Retenção</h3>
              <p className="text-3xl font-bold mt-2">92%</p>
              <p className="text-sm text-muted-foreground mt-2">+2% no último mês</p>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Crescimento de Usuários</h3>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart3 className="h-24 w-24 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground absolute">Gráfico de crescimento de usuários</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Atividade por Módulo</h3>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart3 className="h-24 w-24 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground absolute">Gráfico de atividade por módulo</p>
              </div>
            </Card>
          </div>
          
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
