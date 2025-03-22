
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Puzzle, 
  CreditCard, 
  Package, 
  Database, 
  MessageSquare, 
  Quote, 
  MapPin, 
  Settings2,
  Plus
} from "lucide-react";

const AdminRegistrations = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Cadastros</h1>
        <p className="text-muted-foreground mt-0.5">
          Gerencie os cadastros da plataforma
        </p>
      </div>

      <Tabs defaultValue="areas" className="w-full">
        <div className="bg-white p-2 rounded-lg shadow-sm mb-4 overflow-x-auto">
          <TabsList className="flex items-center justify-start gap-1 min-w-max">
            <TabsTrigger value="areas" className="flex items-center gap-1 rounded-md">
              <MapPin className="h-4 w-4" />
              Áreas
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-1 rounded-md">
              <Building2 className="h-4 w-4" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="credit-packages" className="flex items-center gap-1 rounded-md">
              <Package className="h-4 w-4" />
              Pacotes de Créditos
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-1 rounded-md">
              <Database className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-1 rounded-md">
              <Puzzle className="h-4 w-4" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="parameter-functions" className="flex items-center gap-1 rounded-md">
              <Settings2 className="h-4 w-4" />
              Parametrização de Funções
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-1 rounded-md">
              <CreditCard className="h-4 w-4" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-1 rounded-md">
              <MessageSquare className="h-4 w-4" />
              Prompt
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-1 rounded-md">
              <Quote className="h-4 w-4" />
              Depoimentos
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 rounded-md">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Áreas tab content */}
        <TabsContent value="areas">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Áreas</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Nova Área
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Empresas tab content */}
        <TabsContent value="companies">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Empresas</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Nova Empresa
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Pacotes de Créditos tab content */}
        <TabsContent value="credit-packages">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Pacotes de Créditos</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Novo Pacote
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Integrações tab content */}
        <TabsContent value="integrations">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Integrações</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Nova Integração
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Módulos tab content */}
        <TabsContent value="modules">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Módulos</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Novo Módulo
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Parametrização de Funções tab content */}
        <TabsContent value="parameter-functions">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Parametrização de Funções</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Nova Função
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Planos tab content */}
        <TabsContent value="plans">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Planos</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Novo Plano
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Prompt tab content */}
        <TabsContent value="prompt">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Prompts</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Novo Prompt
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Depoimentos tab content */}
        <TabsContent value="testimonials">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Depoimentos</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Novo Depoimento
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Usuários tab content */}
        <TabsContent value="users">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Cadastro de Usuários</h2>
              <Button className="flex items-center gap-1" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Novo Usuário
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRegistrations;
