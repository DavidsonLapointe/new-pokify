
import React, { useState } from "react";
import { Building2, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// Interface for Area objects
interface Area {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

const OrganizationAreas = () => {
  // Mock data for areas
  const [areas, setAreas] = useState<Area[]>([
    { id: "1", name: "Financeiro", description: "Área responsável pelas finanças da empresa", isDefault: true },
    { id: "2", name: "Recursos Humanos", description: "Área responsável pela gestão de pessoas", isDefault: true },
    { id: "3", name: "Contabilidade", description: "Área responsável pela contabilidade da empresa", isDefault: true },
    { id: "4", name: "Marketing", description: "Área responsável pelo marketing da empresa", isDefault: true },
    { id: "5", name: "Vendas", description: "Área responsável pelas vendas da empresa", isDefault: true },
    { id: "6", name: "Controladoria", description: "Área responsável pelo controle financeiro da empresa", isDefault: true },
    { id: "7", name: "Logística", description: "Área responsável pela logística da empresa", isDefault: true },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Sort areas alphabetically by name
  const sortedAreas = [...areas].sort((a, b) => a.name.localeCompare(b.name));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateDialog = () => {
    setCurrentArea(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (area: Area) => {
    setCurrentArea(area);
    setFormData({
      name: area.name,
      description: area.description
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (area: Area) => {
    setCurrentArea(area);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("O nome da área é obrigatório");
      return;
    }

    if (currentArea) {
      // Edit existing area
      setAreas(prev => 
        prev.map(area => 
          area.id === currentArea.id 
            ? { ...area, name: formData.name, description: formData.description }
            : area
        )
      );
      toast.success("Área atualizada com sucesso");
    } else {
      // Create new area
      const newArea: Area = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        isDefault: false
      };
      setAreas(prev => [...prev, newArea]);
      toast.success("Área criada com sucesso");
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentArea) {
      setAreas(prev => prev.filter(area => area.id !== currentArea.id));
      toast.success("Área excluída com sucesso");
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Áreas</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Área
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAreas.map((area) => (
          <Card key={area.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 pb-2">
              <CardTitle className="flex items-center text-lg">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                {area.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">{area.description}</p>
              <div className="flex justify-between items-center">
                {area.isDefault ? (
                  <span className="text-xs bg-slate-100 text-slate-600 py-1 px-2 rounded">Área padrão</span>
                ) : (
                  <span></span>
                )}
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openEditDialog(area)}
                    disabled={false}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openDeleteDialog(area)}
                    disabled={area.isDefault}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Area Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentArea ? "Editar Área" : "Nova Área"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Área</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Tecnologia"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva a função desta área na empresa"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {currentArea ? "Salvar Alterações" : "Criar Área"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Área</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir a área <strong>{currentArea?.name}</strong>?
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationAreas;
