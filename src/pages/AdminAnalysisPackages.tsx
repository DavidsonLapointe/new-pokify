
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  fetchAnalysisPackages, 
  createAnalysisPackage, 
  updateAnalysisPackage, 
  togglePackageActive 
} from "@/services/analysisPackageService";

const AdminAnalysisPackages = () => {
  const [packages, setPackages] = useState<AnalysisPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<NewPackageForm>({
    name: "",
    credits: "",
    price: ""
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const fetchedPackages = await fetchAnalysisPackages();
      setPackages(fetchedPackages);
    } catch (error) {
      console.error("Erro ao carregar pacotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

    try {
      await createAnalysisPackage(newPackage);
      await loadPackages();
      setNewPackage({ name: "", credits: "", price: "" });
      setIsCreateDialogOpen(false);
      toast.success("Pacote criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar pacote:", error);
      toast.error("Ocorreu um erro ao criar o pacote");
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;

    try {
      await updateAnalysisPackage(editingPackage.id, editingPackage);
      await loadPackages();
      setEditingPackage(null);
      setIsEditDialogOpen(false);
      toast.success("Pacote atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar pacote:", error);
      toast.error("Ocorreu um erro ao atualizar o pacote");
    }
  };

  const handleToggleActive = async (pkg: AnalysisPackage, active: boolean) => {
    try {
      await togglePackageActive(pkg.id, active);
      await loadPackages();
    } catch (error) {
      console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote:`, error);
    }
  };

  return (
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
            {isLoading ? (
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
  );
};

export default AdminAnalysisPackages;
