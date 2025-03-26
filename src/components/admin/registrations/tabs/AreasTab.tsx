import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/realClient";

// Define the user data type to avoid deep type instantiation
interface LinkedUser {
  id: string;
  name: string;
  email: string;
  organization_name?: string;
}

// Interface for summarized company data
interface CompanySummary {
  name: string;
  activeUsers: number;
  pendingUsers: number;
}

// Interface for adapting CompanyArea to correspond to the table in the database
interface AreaData {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

export const AreasTab = () => {
  // Estado para áreas - agora vamos buscar do Supabase
  const [areas, setAreas] = useState<CompanyArea[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState<CompanyArea | null>(null);
  const [deletedAreaName, setDeletedAreaName] = useState<string>("");
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [companySummaries, setCompanySummaries] = useState<CompanySummary[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Função para buscar áreas do Supabase - filtrando apenas default=true
  const fetchAreas = async () => {
    setLoadingAreas(true);
    try {
      console.log("Iniciando busca de áreas padrão...");
      
      // Modificado para filtrar apenas áreas com default=true
      const { data: areasData, error } = await supabase
        .from('areas')
        .select('*')
        .eq('default', true);  // Filtro adicionado aqui

      if (error) {
        throw error;
      }

      if (!areasData) {
        setAreas([]);
        return;
      }

      console.log('Áreas padrão retornadas pelo Supabase:', areasData);

      // Mapear os dados do Supabase para o formato de CompanyArea
      const mappedAreas: CompanyArea[] = areasData.map(area => ({
        id: area.id.toString(),
        name: area.name || '',
        description: area.description || '',
        isDefault: area.default || true
        // Removido organization_id para resolver o erro de tipagem
      }));

      console.log('Áreas mapeadas:', mappedAreas);
      setAreas(mappedAreas);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error(`Erro ao carregar áreas: ${errorMessage}`);
      setAreas([]);
    } finally {
      setLoadingAreas(false);
    }
  };

  // Buscar áreas ao montar o componente
  useEffect(() => {
    fetchAreas();
  }, []);

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
      description: area.description || ''
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = async (area: CompanyArea) => {
    // Verifica se existem usuários vinculados a esta área antes de permitir a exclusão
    const areaUsers = await checkForLinkedUsers(area.id);
    
    if (areaUsers.length > 0) {
      setLinkedUsers(areaUsers);
      
      // Processa os usuários para obter os resumos das empresas
      const summaries = processUsersByCompany(areaUsers);
      setCompanySummaries(summaries);
      
      setCurrentArea(area);
      setIsDeleteWarningOpen(true);
    } else {
      setCurrentArea(area);
      setIsDeleteDialogOpen(true);
    }
  };

  // Group users by company and count active/pending
  const processUsersByCompany = (users: LinkedUser[]): CompanySummary[] => {
    const companies: { [key: string]: { active: number, pending: number } } = {};
    
    users.forEach(user => {
      const companyName = user.organization_name || 'Sem empresa';
      
      if (!companies[companyName]) {
        companies[companyName] = { active: 0, pending: 0 };
      }
      
      // In a real implementation, you would check user.status
      // For this mock, we'll assume all users are active
      companies[companyName].active += 1;
    });
    
    return Object.entries(companies).map(([name, counts]) => ({
      name,
      activeUsers: counts.active,
      pendingUsers: counts.pending
    }));
  };

  // Verifica usuários vinculados a uma área
  const checkForLinkedUsers = async (areaId: string): Promise<LinkedUser[]> => {
    try {
      console.log(`Verificando usuários vinculados à área ID ${areaId}`);
      
      // Aqui poderia ter uma consulta real ao Supabase para verificar usuários vinculados
      // Por enquanto, retornamos um array vazio para todas as áreas
      return [];
    } catch (error) {
      console.error("Erro ao verificar usuários vinculados:", error);
      toast.error("Erro ao verificar usuários vinculados");
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("O nome da área é obrigatório");
      return;
    }

    try {
      if (currentArea) {
        // Editar área existente
        const { error } = await supabase
          .from('areas')
          .update({
            name: formData.name,
            description: formData.description,
          })
          .eq('id', currentArea.id);

        if (error) throw error;
        
        // Atualiza o estado local
        setAreas(prev => 
          prev.map(area => 
            area.id === currentArea.id 
              ? { ...area, name: formData.name, description: formData.description }
              : area
          )
        );
        
        toast.success("Área atualizada com sucesso");
      } else {
        // Criar nova área
        const { data, error } = await supabase
          .from('areas')
          .insert({
            name: formData.name,
            description: formData.description,
            default: true, // Sempre true conforme solicitado
            created_at: new Date().toISOString()
            // organization_id não é incluído
          })
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Adiciona a nova área ao estado local
          const newArea: CompanyArea = {
            id: data[0].id.toString(),
            name: data[0].name,
            description: data[0].description,
            isDefault: true
            // Removido organization_id para resolver o erro de tipagem
          };
          
          setAreas(prev => [...prev, newArea]);
          toast.success("Área criada com sucesso");
        }
      }
      
      setIsDialogOpen(false);
      // Recarrega as áreas para ter os dados mais atualizados
      fetchAreas();
    } catch (error) {
      console.error('Erro ao salvar área:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error(`Erro ao salvar área: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    if (currentArea) {
      try {
        // Salva o nome da área antes de removê-la
        setDeletedAreaName(currentArea.name);
        
        // Exclui a área do Supabase
        const { error } = await supabase
          .from('areas')
          .delete()
          .eq('id', currentArea.id);

        if (error) throw error;
        
        // Atualiza o estado local
        setAreas(prev => prev.filter(area => area.id !== currentArea.id));
        
        setIsDeleteDialogOpen(false);
        setIsSuccessDialogOpen(true);
      } catch (error) {
        console.error('Erro ao excluir área:', error);
        
        let errorMessage = 'Erro desconhecido';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          errorMessage = JSON.stringify(error);
        }
        
        toast.error(`Erro ao excluir área: ${errorMessage}`);
      }
    }
  };

  return (
    <>
      <div className="px-6">
        <CardTitle className="text-left">Áreas</CardTitle>
        <p className="text-muted-foreground text-left">
          Gerencie as áreas padrão que estarão disponíveis para todas as empresas.
        </p>
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-6">
          <div className="invisible h-0 w-0">Placeholder</div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Área
          </Button>
        </div>

        {loadingAreas ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Carregando áreas...</span>
          </div>
        ) : (
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
        )}
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

      {/* Warning Dialog for Linked Users - Modified to show company summaries */}
      <AlertDialog open={isDeleteWarningOpen} onOpenChange={setIsDeleteWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Impossível excluir área
            </AlertDialogTitle>
            <AlertDialogDescription>
              A área <strong>{currentArea?.name}</strong> não pode ser excluída pois existem usuários ativos ou pendentes vinculados a ela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 border rounded-md overflow-hidden">
            <div className="bg-slate-50 p-3 font-medium border-b">
              Usuários vinculados à área
            </div>
            <div className="divide-y">
              {companySummaries.map((company, index) => (
                <div key={index} className="p-3">
                  <p className="font-medium">{company.name}</p>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>{company.activeUsers} usuário{company.activeUsers !== 1 ? 's' : ''} ativo{company.activeUsers !== 1 ? 's' : ''}</p>
                    {company.pendingUsers > 0 && (
                      <p>{company.pendingUsers} usuário{company.pendingUsers !== 1 ? 's' : ''} pendente{company.pendingUsers !== 1 ? 's' : ''}</p>
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
