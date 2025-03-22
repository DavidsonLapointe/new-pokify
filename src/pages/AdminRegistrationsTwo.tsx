
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, CreditCard, Database, MessageSquare, Puzzle, Quote } from "lucide-react";

const AdminRegistrationsTwo = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro 2</h1>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="integrações" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="integrações">
                <Database className="w-4 h-4 mr-2" />
                Integrações
              </TabsTrigger>
              <TabsTrigger value="módulos">
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
            
            <TabsContent value="integrações">
              <CardTitle>Integrações</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="módulos">
              <CardTitle>Módulos</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="pacotes-creditos">
              <CardTitle>Pacotes de Créditos</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="planos">
              <CardTitle>Planos</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="prompts">
              <CardTitle>Prompts</CardTitle>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">
                  O conteúdo desta aba será implementado posteriormente.
                </p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="depoimentos">
              <CardTitle>Depoimentos</CardTitle>
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

export default AdminRegistrationsTwo;
