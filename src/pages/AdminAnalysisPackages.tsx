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
import { Switch } from "@/components/ui/switch";
import { Package, Plus, Pencil, Infinity } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
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

              <form onSubmit={handleCreatePackage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Pacote *</Label>
                  <Input
                    id="name"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    placeholder="Ex: Pacote Premium"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="credits">Quantidade de Créditos *</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={newPackage.credits}
                    onChange={(e) => setNewPackage({ ...newPackage, credits: e.target.value })}
                    placeholder="Ex: 100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    placeholder="Ex: 199.90"
                    required
                  />
                </div>

                <p className="text-sm text-muted-foreground">* Campos obrigatórios</p>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="cancel"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Pacote
                  </Button>
                </div>
              </form>
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
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 border rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors group"
                  >
                    <div>
                      <h3 className="font-medium">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pkg.credits} {pkg.credits === 1 ? 'crédito' : 'créditos'} para análises de arquivos
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">
                        R$ {pkg.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setEditingPackage(pkg);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Pacote</DialogTitle>
                            </DialogHeader>
                            {editingPackage && (
                              <form onSubmit={handleUpdatePackage} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Nome do Pacote</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingPackage.name}
                                    onChange={(e) => setEditingPackage({
                                      ...editingPackage,
                                      name: e.target.value
                                    })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-credits">Quantidade de Créditos</Label>
                                  <Input
                                    id="edit-credits"
                                    type="number"
                                    value={editingPackage.credits}
                                    onChange={(e) => setEditingPackage({
                                      ...editingPackage,
                                      credits: parseInt(e.target.value) || 0
                                    })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-price">Preço (R$)</Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    value={editingPackage.price}
                                    onChange={(e) => setEditingPackage({
                                      ...editingPackage,
                                      price: parseFloat(e.target.value) || 0
                                    })}
                                  />
                                </div>

                                <div className="flex justify-end gap-4">
                                  <Button
                                    type="button"
                                    variant="cancel"
                                    onClick={() => setIsEditDialogOpen(false)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button type="submit">
                                    Salvar Alterações
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={pkg.active}
                            onCheckedChange={(checked) => {
                              setPackages(packages.map(p => 
                                p.id === pkg.id ? { ...p, active: checked } : p
                              ));
                              toast.success(`Pacote ${checked ? 'ativado' : 'desativado'} com sucesso`);
                            }}
                          />
                          <span className={`text-sm ${pkg.active ? 'text-green-600' : 'text-red-600'}`}>
                            {pkg.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
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
