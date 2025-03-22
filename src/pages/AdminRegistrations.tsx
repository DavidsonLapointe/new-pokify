
import { Card } from "@/components/ui/card";

const AdminRegistrations = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Cadastros</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os cadastros da plataforma
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Conteúdo em Desenvolvimento</h2>
        <p className="text-muted-foreground">
          Esta seção está em desenvolvimento e estará disponível em breve.
        </p>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
