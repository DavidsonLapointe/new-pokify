
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FileText, UserCheck, ChevronRight } from "lucide-react";

const ContractingCompanyDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel da Empresa Contratante</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas operações e visualize dados em tempo real
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  Projetos Ativos
                </CardTitle>
                <CardDescription>Total de projetos em andamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Aumento de 8% comparado ao mês anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Contratos Vigentes
                </CardTitle>
                <CardDescription>Contratos em execução</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground mt-2">
                  2 contratos a vencer nos próximos 30 dias
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-primary" />
                  Equipes Alocadas
                </CardTitle>
                <CardDescription>Funcionários em projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">42</div>
                <div className="text-sm text-muted-foreground mt-2">
                  85% da capacidade total utilizada
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Acompanhe as últimas atualizações dos seus projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  {
                    title: "Novo contrato assinado",
                    description: "Contrato #2458 foi aprovado e assinado",
                    time: "Há 2 horas"
                  },
                  {
                    title: "Relatório mensal disponível",
                    description: "O relatório de Maio/2023 está pronto para revisão",
                    time: "Há 1 dia"
                  },
                  {
                    title: "Atualização de projeto",
                    description: "Projeto Alpha teve seu cronograma atualizado",
                    time: "Há 3 dias"
                  },
                  {
                    title: "Novo funcionário adicionado",
                    description: "João Silva foi adicionado ao Projeto Beta",
                    time: "Há 5 dias"
                  }
                ].map((activity, index) => (
                  <li key={index} className="flex items-start justify-between p-3 rounded-md hover:bg-muted">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">{activity.time}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Contratos</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os seus contratos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Conteúdo da aba de contratos em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários</CardTitle>
              <CardDescription>
                Gerencie seus funcionários e suas alocações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Conteúdo da aba de funcionários em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractingCompanyDashboard;
