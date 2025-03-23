
import React, { useState } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Building2, Plus, Trash2, Pencil, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyArea } from "@/components/admin/modules/module-form-schema";
import { supabase } from "@/integrations/supabase/client";

// Define the user data type to avoid deep type instantiation
interface LinkedUser {
  id: string;
  name: string;
  email: string;
  organization_name?: string;
}

export const AreasTab = () => {
  // State for areas - now all areas are standard areas that can be edited by admin
  const [areas, setAreas] = useState<CompanyArea[]>([
    { id: "1", name: "Financeiro", description: "Área responsável pelas finanças da empresa", isDefault: true },
    { id: "2", name: "Recursos Humanos", description: "Área responsável pela gestão de pessoas", isDefault: true },
    { id: "3", name: "Contabilidade", description: "Área responsável pela contabilidade da empresa", isDefault: true },
    { id: "4", name: "Marketing", description: "Área responsável pelo marketing da empresa", isDefault: true },
    { id: "5", name: "Vendas", description: "Área responsável pelas vendas da empresa", isDefault: true },
    { id: "6", name: "Controladoria", description: "Área responsável pelo controle financeiro da empresa", isDefault: true },
    { id: "7", name: "Logística", description: "Área responsável pela logística da empresa", isDefault: true },
    { id: "8", name: "Jurídico", description: "Área responsável pelos assuntos jurídicos da empresa", isDefault: true },
    { id: "9", name: "PERA", description: "Área de Pesquisa e Recursos Avançados", isDefault: true },
  ]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState<CompanyArea | null>(null);
  const [deletedAreaName, setDeletedAreaName] = useState<string>("");
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  
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

  const openEditDialog = (area: CompanyArea) => {
    setCurrentArea(area);
    setFormData({
      name: area.name,
      description: area.description
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = async (area: CompanyArea) => {
    // Check if any users are linked to this area before allowing deletion
    const areaUsers = await checkForLinkedUsers(area.name);
    
    if (areaUsers.length > 0) {
      setLinkedUsers(areaUsers);
      setCurrentArea(area);
      setIsDeleteWarningOpen(true);
    } else {
      setCurrentArea(area);
      setIsDeleteDialogOpen(true);
    }
  };

  // Simplified version that bypasses TypeScript's deep instantiation issue
  const checkForLinkedUsers = async (areaName: string): Promise<LinkedUser[]> => {
    try {
      // First, get the profiles with matching area
      const profilesResponse = await supabase.rpc(
        'get_profiles_by_area', 
        { area_name: areaName }
      );
      
      if (profilesResponse.error) {
        console.error("Error fetching profiles:", profilesResponse.error);
        toast.error("Erro ao verificar usuários vinculados");
        return [];
      }
      
      // Use type assertion to bypass complex nested type inference
      const profiles = profilesResponse.data as Array<{
        id: string;
        name: string;
        email: string;
        organization_id: string | null;
      }>;
      
      if (!profiles || profiles.length === 0) {
        return [];
      }
      
      // Convert to LinkedUser objects
      const users: LinkedUser[] = [];
      
      for (const profile of profiles) {
        const user: LinkedUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email
        };
        
        // Only get organization name if there's an organization_id
        if (profile.organization_id) {
          try {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', profile.organization_id)
              .single();
              
            if (orgData) {
              user.organization_name = orgData.name;
            }
          } catch (err) {
            console.error("Error fetching organization:", err);
          }
        }
        
        users.push(user);
      }
      
      return users;
    } catch (error) {
      console.error("Error in checkForLinkedUsers:", error);
      toast.error("Erro ao verificar usuários vinculados");
      return [];
    }
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
      const newArea: CompanyArea = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        isDefault: true // All areas created here are default areas
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
    <>
      <CardTitle>Áreas</CardTitle>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Gerencie as áreas padrão que estarão disponíveis para todas as empresas.
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Área
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAreas.map((area) => (
            <div key={area.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-50 p-4 border-b">
                <h3 className="flex items-center text-lg font-semibold">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  {area.name}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">{area.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-primary text-white py-1 px-2 rounded">Área padrão</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(area)}
                      className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteDialog(area)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

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
              variant="outline" 
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
        <AlertDialogContent>
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
                    {user.organization_name && (
                      <p className="text-xs text-gray-400">Empresa: {user.organization_name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
