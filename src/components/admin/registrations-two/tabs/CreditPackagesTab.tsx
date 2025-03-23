
import { CardTitle } from "@/components/ui/card";
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus, Package, Infinity } from "lucide-react";
import { toast } from "sonner";
import { CreatePackageForm } from "@/components/admin/packages/CreatePackageForm";
import { EditPackageForm } from "@/components/admin/packages/EditPackageForm";
import { PackagesList } from "@/components/admin/packages/PackagesList";
import { AnalysisPackage, NewPackageForm } from "@/types/packages";

// Mocked packages data - same as in AdminAnalysisPackages.tsx
const mockedPackages: AnalysisPackage[] = [
  {
    id: "pkg-001",
    name: "Pacote Básico",
    credits: 50,
    price: 99.90,
    active: true,
    stripeProductId: "prod_mock_001",
    stripePriceId: "price_mock_001"
  },
  {
    id: "pkg-002",
    name: "Pacote Profissional",
    credits: 150,
    price: 249.90,
    active: true,
    stripeProductId: "prod_mock_002",
    stripePriceId: "price_mock_002"
  },
  {
    id: "pkg-003",
    name: "Pacote Empresarial",
    credits: 500,
    price: 699.90,
    active: true,
    stripeProductId: "prod_mock_003",
    stripePriceId: "price_mock_003"
  }
];

export const CreditPackagesTab = () => {
  const [packages, setPackages] = useState<AnalysisPackage[]>(mockedPackages);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<NewPackageForm>({
    name: "",
    credits: "",
    price: ""
  });

  // Effect for loading packages simulation
  useEffect(() => {
    // Just for visual demonstration, set a brief loading state
    setIsLoadingPackages(true);
    setTimeout(() => {
      setIsLoadingPackages(false);
    }, 1000);
  }, []);

  const handleCreatePackage = async (e: React.FormEvent) => {
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
      toast(`Por favor, preencha os seguintes campos: ${emptyFields.join(", ")}`);
      return;
    }

    const credits = parseInt(newPackage.credits);
    const price = parseFloat(newPackage.price);

    if (isNaN(credits) || credits <= 0) {
      toast(`A quantidade de créditos deve ser um número positivo`);
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast(`O preço deve ser um número positivo`);
      return;
    }

    toast.promise(
      // Promise to simulate API call
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // For demo, just add to local state
          const newId = `pkg-${Date.now().toString().slice(-3)}`;
          const newPkg: AnalysisPackage = {
            id: newId,
            name: newPackage.name,
            credits: credits,
            price: price,
            active: true,
            stripeProductId: `prod_mock_${newId}`,
            stripePriceId: `price_mock_${newId}`
          };
          
          setPackages([...packages, newPkg]);
          setNewPackage({ name: "", credits: "", price: "" });
          setIsCreateDialogOpen(false);
          resolve();
        }, 1000);
      }),
      {
        loading: 'Criando pacote e cadastrando no Stripe...',
        success: 'Pacote criado com sucesso e registrado no Stripe',
        error: 'Ocorreu um erro ao criar o pacote'
      }
    );
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;

    toast.promise(
      // Promise to simulate API call
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // For demo, just update local state
          const updatedPackages = packages.map(pkg => 
            pkg.id === editingPackage.id ? editingPackage : pkg
          );
          setPackages(updatedPackages);
          setEditingPackage(null);
          setIsEditDialogOpen(false);
          resolve();
        }, 1000);
      }),
      {
        loading: 'Atualizando pacote e sincronizando com o Stripe...',
        success: 'Pacote atualizado com sucesso e sincronizado com o Stripe',
        error: 'Ocorreu um erro ao atualizar o pacote'
      }
    );
  };

  const handleToggleActive = async (pkg: AnalysisPackage, active: boolean) => {
    toast.promise(
      // Promise to simulate API call
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // For demo, just update local state
          const updatedPackages = packages.map(p => 
            p.id === pkg.id ? { ...p, active } : p
          );
          setPackages(updatedPackages);
          resolve();
        }, 1000);
      }),
      {
        loading: `${active ? 'Ativando' : 'Desativando'} pacote e atualizando no Stripe...`,
        success: `Pacote ${active ? 'ativado' : 'desativado'} com sucesso`,
        error: `Erro ao ${active ? 'ativar' : 'desativar'} pacote`
      }
    );
  };

  return (
    <div className="text-left">
      <CardTitle>Pacotes de Créditos</CardTitle>
      <div className="pt-2">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">
              Gerencie os pacotes de créditos adicionais
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
                  <DialogTitle>Novo Pacote de Créditos</DialogTitle>
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
                {isLoadingPackages ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="p-4 border rounded-lg flex items-center justify-between animate-pulse"
                      >
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-10 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <PackagesList 
                    packages={packages}
                    onEdit={(pkg) => {
                      setEditingPackage(pkg);
                      setIsEditDialogOpen(true);
                    }}
                    onToggleActive={handleToggleActive}
                  />
                )}
              </CardContent>
            </Card>
          </div>
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
    </div>
  );
};
