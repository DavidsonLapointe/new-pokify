
import AdminLayout from "@/components/AdminLayout";
import { CreatePackageForm } from "@/components/admin/packages/CreatePackageForm";
import { EditPackageForm } from "@/components/admin/packages/EditPackageForm";
import { PackagesList } from "@/components/admin/packages/PackagesList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AnalysisPackage, NewPackageForm } from "@/types/packages";
import { Infinity, Package, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<NewPackageForm>({
    name: "",
    credits: "",
    price: ""
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emptyFields: string[] = [];
    
    if (!newPackage.name.trim()) {
      emptyFields.push("Nome do pacote");
    }
    if (!newPackage.credits) {
      emptyFields.push("Quantidade de créditos");
    }
    if (!newPackage.price) {
      emptyFields.push("Preço");
    }

    if (emptyFields.length > 0) {
      toast.error(
        `Por favor, preencha os seguintes campos: ${emptyFields.join(", ")}`
      );
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
    setIsCreateDialogOpen(false);
    toast.success("Pacote criado com sucesso");
  };

  const handleUpdatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;

    const updatedPackages = packages.map(pkg => 
      pkg.id === editingPackage.id ? editingPackage : pkg
    );

    setPackages(updatedPackages);
    setEditingPackage(null);
    setIsEditDialogOpen(false);
    toast.success("Pacote atualizado com sucesso");
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="w-full"
                >
                  Criar Pacote
                </Button>
              </CardContent>
            </Card>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Pacote de Análise</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo pacote de créditos
                </DialogDescription>
              </DialogHeader>

              <CreatePackageForm
                newPackage={newPackage}
                onSubmit={handleCreatePackage}
                onChange={(field, value) => setNewPackage(prev => ({ ...prev, [field]: value }))}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Pacotes Disponíveis
              </CardTitle>
              <CardDescription>
                Pacotes de créditos atualmente disponíveis para venda
              </CardDescription>
              <div className="mt-4 flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                <Infinity className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Os créditos adquiridos não expiram ao final do mês, ficando disponíveis até serem utilizados
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <PackagesList 
                packages={packages}
                onEdit={(pkg) => {
                  setEditingPackage(pkg);
                  setIsEditDialogOpen(true);
                }}
                onToggleActive={(pkg, active) => {
                  setPackages(packages.map(p => 
                    p.id === pkg.id ? { ...p, active } : p
                  ));
                }}
              />
            </CardContent>
          </Card>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Pacote</DialogTitle>
            </DialogHeader>
            {editingPackage && (
              <EditPackageForm
                package_={editingPackage}
                onSubmit={handleUpdatePackage}
                onChange={(field, value) => setEditingPackage(prev => ({ ...prev!, [field]: value }))}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalysisPackages;
