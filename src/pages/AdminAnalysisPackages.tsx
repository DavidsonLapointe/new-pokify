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
import { useAnalysisPackages } from "@/hooks/useAnalysisPackages";

const AdminAnalysisPackages = () => {
  const { 
    packages, 
    isLoading, 
    error, 
    refetch, 
    addPackage, 
    updatePackage, 
    togglePackageStatus 
  } = useAnalysisPackages();

  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<NewPackageForm>({
    name: "",
    credits: "",
    price: ""
  });

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

    toast.loading("Criando pacote...");
    
    try {
      await addPackage({
        name: newPackage.name,
        credits: credits,
        price: price,
        active: true
      });
      
      setNewPackage({ name: "", credits: "", price: "" });
      setIsCreateDialogOpen(false);
      toast.dismiss();
      toast.success("Pacote criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar pacote:", error);
      toast.dismiss();
      toast.error("Ocorreu um erro ao criar o pacote");
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;

    toast.loading("Atualizando pacote...");
    
    try {
      await updatePackage(editingPackage.id, editingPackage);
      setEditingPackage(null);
      setIsEditDialogOpen(false);
      toast.dismiss();
      toast.success("Pacote atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar pacote:", error);
      toast.dismiss();
      toast.error("Ocorreu um erro ao atualizar o pacote");
    }
  };

  const handleToggleActive = async (pkg: AnalysisPackage) => {
    const newStatus = !pkg.active;
    toast.loading(`${newStatus ? 'Ativando' : 'Desativando'} pacote...`);
    
    try {
      await togglePackageStatus(pkg.id);
      toast.dismiss();
      toast.success(`Pacote ${newStatus ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error(`Erro ao ${newStatus ? 'ativar' : 'desativar'} pacote:`, error);
      toast.dismiss();
      toast.error(`Ocorreu um erro ao ${newStatus ? 'ativar' : 'desativar'} o pacote`);
    }
  };

  const handleEditPackage = (pkg: AnalysisPackage) => {
    setEditingPackage({ ...pkg });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Pacotes de Análise
            </CardTitle>
            <CardDescription>
              Gerencie os pacotes de análise disponíveis para venda
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Pacote
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-600">
                  Erro ao carregar pacotes. Por favor, tente novamente.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            <PackagesList
              packages={packages || []}
              isLoading={isLoading}
              onEdit={handleEditPackage}
              onToggleActive={handleToggleActive}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Package Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Pacote</DialogTitle>
            <DialogDescription>
              Defina os detalhes do novo pacote de análise
            </DialogDescription>
          </DialogHeader>
          <CreatePackageForm
            newPackage={newPackage}
            setNewPackage={setNewPackage}
            onSubmit={handleCreatePackage}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Pacote</DialogTitle>
            <DialogDescription>
              Atualize os detalhes do pacote de análise
            </DialogDescription>
          </DialogHeader>
          {editingPackage && (
            <EditPackageForm
              editingPackage={editingPackage}
              setEditingPackage={setEditingPackage}
              onSubmit={handleUpdatePackage}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnalysisPackages;
