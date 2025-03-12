import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Phone, ChartBar } from "lucide-react";
import { Link } from "react-router-dom";

const OrganizationContracting = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-[#9b87f5] fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white">
            <Building2 className="w-4 h-4 text-white" />
            <span className="font-medium">Empresa Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-white">Usuário Demo</p>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="w-64 bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30 border-r border-gray-200">
        <nav className="flex flex-col h-full py-6 px-3">
          <div className="space-y-0.5">
            <Link
              to="/dev/contracting"
              className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-[#9b87f5]"
            >
              <ChartBar className="w-4 h-4 mr-3 text-[#9b87f5]" />
              Dashboard
            </Link>
            <Link
              to="/dev/sales-process"
              className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-gray-600"
            >
              <Users className="w-4 h-4 mr-3 text-gray-600" />
              Processo de Vendas
            </Link>
            <Link
              to="#"
              className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-gray-600"
            >
              <Phone className="w-4 h-4 mr-3 text-gray-600" />
              Chamadas
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16">
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Bem-vindo ao seu painel de controle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Chamadas
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">145</div>
                  <p className="text-xs text-muted-foreground">
                    +20% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuários Ativos
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    3 novos esta semana
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Conversão
                  </CardTitle>
                  <ChartBar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Link to="/dev/sales-process">
                <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Processo de Vendas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizationContracting;
