
import React, { useState } from "react";
import { Building2, Plus, Trash2, Pencil, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useOrganizationUsers } from "@/hooks/useOrganizationUsers";

// Interface for Area objects
interface Area {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

// Mock interface for linked users - in a real application, we would need to extend this
interface LinkedUser {
  id: string;
  name: string;
  email: string;
  area: string;
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
    { id: "8", name: "Jurídico", description: "Área responsável pelos assuntos jurídicos da empresa", isDefault: true },
    { id: "9", name: "PERA", description: "Área de Pesquisa e Recursos Avançados", isDefault: false },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [deletedAreaName, setDeletedAreaName] = useState<string>("");
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Get organization users to check for linked users
  const { users } = useOrganizationUsers();

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
    // Check if any users are linked to this area before allowing deletion
    const areaUsers = checkForLinkedUsers(area.id);
    
    if (areaUsers.length > 0) {
      setLinkedUsers(areaUsers);
      setCurrentArea(area);
      setIsDeleteWarningOpen(true);
    } else {
      setCurrentArea(area);
      setIsDeleteDialogOpen(true);
    }
  };

  // Mock function to check for linked users - in real app, this would query the database
  const checkForLinkedUsers = (areaId: string): LinkedUser[] => {
    // Simulation for the PERA area (id=9)
    if (areaId === "9") {
      return [
        { id: "u1", name: "Carlos Oliveira", email: "carlos.oliveira@example.com", area: "PERA" },
        { id: "u2", name: "Ana Beatriz", email: "ana.beatriz@example.com", area: "PERA" },
        { id: "u3", name: "Felipe Santos", email: "felipe.santos@example.com", area: "PERA" }
      ];
    }
    
    // Previous simulation for Marketing (id=4)
    if (areaId === "4") {
      return [
        { id: "u1", name: "João Silva", email: "joao.silva@example.com", area: "Marketing" },
        { id: "u2", name: "Maria Souza", email: "maria.souza@example.com", area: "Marketing" }
      ];
    }
    
    return [];
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
      // Save the area name before removing it
      setDeletedAreaName(currentArea.name);
      setAreas(prev => prev.filter(area => area.id !== currentArea.id));
      setIsDeleteDialogOpen(false);
      setIsSuccessDialogOpen(true);
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
                    className={!area.isDefault ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50" : ""}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  {area.isDefault ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              disabled={true}
                              className="text-red-300 cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Áreas padrão não podem ser excluídas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteDialog(area)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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
            <DialogTitle>
              Excluir Área: <span className="text-primary">{currentArea?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir a área <strong>{currentArea?.name}</strong>?
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="cancel" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog after deletion */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Área excluída com sucesso
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              A área <strong>{deletedAreaName}</strong> foi excluída com sucesso.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsSuccessDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog for Linked Users */}
      <AlertDialog open={isDeleteWarningOpen} onOpenChange={setIsDeleteWarningOpen}>
        <AlertDialogContent className="border-0 shadow-none !border-transparent" style={{ border: 'none', boxShadow: 'none' }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Impossível excluir área
            </AlertDialogTitle>
            <AlertDialogDescription>
              A área <strong>{currentArea?.name}</strong> não pode ser excluída pois existem usuários ativos ou pendentes vinculados a ela. 
              Você precisa primeiro mudar a área destes usuários para depois excluir esta área.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 border rounded-md overflow-hidden">
            <div className="bg-slate-50 p-3 font-medium border-b">
              Usuários vinculados à área
            </div>
            <div className="p-3 space-y-2">
              {linkedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#F1F1F1] text-primary hover:bg-[#E5E5E5]">Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizationAreas;
