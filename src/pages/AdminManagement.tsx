
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminManagement = () => {
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
              <CardTitle>Gestão - Financeiro</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
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
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="setups">
              <CardTitle>Gestão - Setups</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </div>
    </div>
  );
};

export default AdminManagement;
