
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminRegistrations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro 1</h1>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="areas" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="areas">Áreas</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="funcoes">Funções por tipo de usuário</TabsTrigger>
              <TabsTrigger value="minha-empresa">Minha Empresa</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="areas">
              <CardTitle>Áreas</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="empresas">
              <CardTitle>Empresas</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="funcoes">
              <CardTitle>Funções por tipo de usuário</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="minha-empresa">
              <CardTitle>Minha Empresa</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="usuarios">
              <CardTitle>Usuários</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
