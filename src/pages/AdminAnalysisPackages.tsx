
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AnalysisPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  active: boolean;
}

const AdminAnalysisPackages = () => {
  const [packages, setPackages] = useState<AnalysisPackage[]>([
    {
      id: "1",
      name: "Pacote Básico",
      credits: 100,
      price: 199.90,
      active: true,
    },
    {
      id: "2",
      name: "Pacote Intermediário",
      credits: 500,
      price: 899.90,
      active: true,
    },
    {
      id: "3",
      name: "Pacote Avançado",
      credits: 1000,
      price: 1599.90,
      active: true,
    }
  ]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    credits: "",
    price: ""
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPackage.name || !newPackage.credits || !newPackage.price) {
      toast.error("Preencha todos os campos");
      return;
    }

    const credits = parseInt(newPackage.credits);
    const price = parseFloat(newPackage.price);

    if (isNaN(credits) || credits <= 0) {
      toast.error("A quantidade de créditos deve ser um número positivo");
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast.error("O preço deve ser um número positivo");
      return;
    }

    const package_: AnalysisPackage = {
      id: crypto.randomUUID(),
      name: newPackage.name,
      credits: credits,
      price: price,
      active: true,
    };

    setPackages([...packages, package_]);
    setNewPackage({ name: "", credits: "", price: "" });
    toast.success("Pacote criado com sucesso");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Pacotes de Análise</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os pacotes de créditos adicionais para análises
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Form para criar novo pacote */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Novo Pacote
              </CardTitle>
              <CardDescription>
                Crie um novo pacote de créditos para análises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePackage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Pacote</Label>
                  <Input
                    id="name"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    placeholder="Ex: Pacote Premium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="credits">Quantidade de Créditos</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={newPackage.credits}
                    onChange={(e) => setNewPackage({ ...newPackage, credits: e.target.value })}
                    placeholder="Ex: 100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    placeholder="Ex: 199.90"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Criar Pacote
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de pacotes existentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Pacotes Disponíveis
              </CardTitle>
              <CardDescription>
                Pacotes de créditos atualmente disponíveis para venda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pkg.credits} créditos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        R$ {pkg.price.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={pkg.active ? "text-green-600" : "text-red-600"}
                        onClick={() => {
                          setPackages(packages.map(p => 
                            p.id === pkg.id ? { ...p, active: !p.active } : p
                          ));
                          toast.success(`Pacote ${pkg.active ? 'desativado' : 'ativado'} com sucesso`);
                        }}
                      >
                        {pkg.active ? "Ativo" : "Inativo"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalysisPackages;
