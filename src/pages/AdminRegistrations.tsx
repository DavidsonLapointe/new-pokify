
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Settings2 
} from "lucide-react";

const AdminRegistrations = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Cadastros</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os cadastros da plataforma
        </p>
      </div>

      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="mb-6 w-full flex flex-wrap items-center justify-start gap-2">
          <TabsTrigger value="areas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Áreas
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Empresas
          </TabsTrigger>
          <TabsTrigger value="credit-packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pacotes de Créditos
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Módulos
          </TabsTrigger>
          <TabsTrigger value="parameter-functions" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Parametrização de Funções
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Prompt
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <Quote className="h-4 w-4" />
            Depoimentos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>
        
        {/* Áreas tab content */}
        <TabsContent value="areas">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Áreas</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Empresas tab content */}
        <TabsContent value="companies">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Empresas</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Pacotes de Créditos tab content */}
        <TabsContent value="credit-packages">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Pacotes de Créditos</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Integrações tab content */}
        <TabsContent value="integrations">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Integrações</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Módulos tab content */}
        <TabsContent value="modules">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Módulos</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Parametrização de Funções tab content */}
        <TabsContent value="parameter-functions">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Parametrização de Funções</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Planos tab content */}
        <TabsContent value="plans">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Planos</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Prompt tab content */}
        <TabsContent value="prompt">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Prompts</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Depoimentos tab content */}
        <TabsContent value="testimonials">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Depoimentos</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>

        {/* Usuários tab content */}
        <TabsContent value="users">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Cadastro de Usuários</h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRegistrations;
