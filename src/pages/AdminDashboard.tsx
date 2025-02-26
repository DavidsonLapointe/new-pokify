
import { Card } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral da plataforma Leadly
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Empresas Ativas</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Usuários Ativos</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Leads Processados</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
