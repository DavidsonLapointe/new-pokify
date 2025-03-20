
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Buildings, 
  Users, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Clock,
  UserCheck
} from "lucide-react";

export const CustomerSuccessDashboard = () => {
  // This would normally be fetched from an API
  const mockStats = {
    totalOrganizations: 42,
    activeOrganizations: 38,
    inactiveOrganizations: 4,
    totalUsers: 256,
    activeUsers: 218,
    pendingUsers: 28,
    inactiveUsers: 10,
    totalExecutions: 12850,
    averageExecutionsPerDay: 215,
    organizationsWithLowCredits: 5,
    averageResponseTime: "1.8s",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Buildings className="h-4 w-4 text-primary" />
              Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalOrganizations}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{mockStats.activeOrganizations} ativas</span> • 
              <span className="text-red-500 font-medium ml-1">{mockStats.inactiveOrganizations} inativas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{mockStats.activeUsers} ativos</span> •
              <span className="text-amber-500 font-medium ml-1">{mockStats.pendingUsers} pendentes</span> •
              <span className="text-red-500 font-medium ml-1">{mockStats.inactiveUsers} inativos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Execuções IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalExecutions.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Média de {mockStats.averageExecutionsPerDay} execuções/dia
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Tempo de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageResponseTime}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Tempo médio de resposta da IA
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Empresas com Poucos Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockStats.organizationsWithLowCredits > 0 ? (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-medium">Empresa ABC</p>
                    <p className="text-sm text-muted-foreground">5 créditos restantes</p>
                  </div>
                  <div className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Crítico
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-medium">Empresa XYZ</p>
                    <p className="text-sm text-muted-foreground">8 créditos restantes</p>
                  </div>
                  <div className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Alerta
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-medium">Empresa 123</p>
                    <p className="text-sm text-muted-foreground">10 créditos restantes</p>
                  </div>
                  <div className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Alerta
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma empresa com poucos créditos
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Empresas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">Empresa Nova LTDA</p>
                  <p className="text-sm text-muted-foreground">Adicionada há 2 dias</p>
                </div>
                <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Ativa
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">Corporação Future</p>
                  <p className="text-sm text-muted-foreground">Adicionada há 5 dias</p>
                </div>
                <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Ativa
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">Startup XYZ</p>
                  <p className="text-sm text-muted-foreground">Adicionada há 7 dias</p>
                </div>
                <div className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  Pendente
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acompanhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <p className="text-muted-foreground">
              Gráfico de acompanhamento mensal de execuções e crescimento de clientes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
