import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { supabase } from "@/integrations/supabase/realClient";

// Interface baseada na estrutura da tabela lead_type do Supabase
interface LeadType {
  id: string;
  name: string;
  cor: string;
  active: boolean;
  created_at: string;
}

export const TiposDeLeadTab = () => {
  const { toast } = useToast();
  const [leadTypes, setLeadTypes] = useState<LeadType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLeadType, setCurrentLeadType] = useState<LeadType | null>(null);
  const [newLeadType, setNewLeadType] = useState({
    name: "",
    cor: "bg-blue-100 text-blue-800",
    active: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Available colors for lead types
  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Azul" },
    { value: "bg-green-100 text-green-800", label: "Verde" },
    { value: "bg-orange-100 text-orange-800", label: "Laranja" },
    { value: "bg-purple-100 text-purple-800", label: "Roxo" },
    { value: "bg-red-100 text-red-800", label: "Vermelho" },
    { value: "bg-gray-100 text-gray-800", label: "Cinza" },
  ];

  // Função para buscar tipos de lead do Supabase
  const fetchLeadTypes = async () => {
    setIsLoading(true);
    try {
      console.log("Buscando tipos de lead do Supabase...");
      
      const { data, error } = await supabase
        .from('lead_type')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      console.log("Tipos de lead retornados:", data);
      
      if (data) {
        setLeadTypes(data);
      } else {
        setLeadTypes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de lead:", error);
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchLeadTypes();
  }, []);

  const handleOpenNewDialog = () => {
    setCurrentLeadType(null);
    setNewLeadType({
      name: "",
      cor: "bg-blue-100 text-blue-800",
      active: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (leadType: LeadType) => {
    setCurrentLeadType(leadType);
    setNewLeadType({
      name: leadType.name,
      cor: leadType.cor,
      active: leadType.active
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (leadType: LeadType) => {
    setCurrentLeadType(leadType);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setNewLeadType(prev => ({ ...prev, [field]: value }));
  };

  const validateLeadType = () => {
    if (!newLeadType.name.trim()) {
      toast({
        variant: "destructive",
        title: "Nome é obrigatório",
        description: "Por favor, insira um nome para o tipo de lead."
      });
      return false;
    }

    // Check if name exists already (ignoring case)
    const nameExists = leadTypes.some(type => 
      type.name.toLowerCase() === newLeadType.name.toLowerCase() && 
      (!currentLeadType || type.id !== currentLeadType.id)
    );

    if (nameExists) {
      toast({
        variant: "destructive",
        title: "Nome já existe",
        description: "Já existe um tipo de lead com este nome. Por favor, escolha outro nome."
      });
      return false;
    }

    return true;
  };

  const handleSaveLeadType = async () => {
    if (!validateLeadType()) return;
    
    setIsLoading(true);
    
    try {
      if (currentLeadType) {
        // Atualizando tipo de lead existente
        const { error } = await supabase
          .from('lead_type')
          .update({
            name: newLeadType.name,
            cor: newLeadType.cor,
            active: newLeadType.active
          })
          .eq('id', currentLeadType.id);

        if (error) throw error;
        
        // Atualiza o estado local
        setLeadTypes(prev => 
          prev.map(lt => 
            lt.id === currentLeadType.id 
              ? {
                  ...lt,
                  name: newLeadType.name,
                  cor: newLeadType.cor,
                  active: newLeadType.active
                }
              : lt
          )
        );
        
        toast({
          title: "Sucesso",
          description: "Tipo de lead atualizado com sucesso!"
        });
      } else {
        // Criando novo tipo de lead
        const { data, error } = await supabase
          .from('lead_type')
          .insert({
            name: newLeadType.name,
            cor: newLeadType.cor,
            active: newLeadType.active,
            created_at: new Date().toISOString()
          })
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          setLeadTypes(prev => [...prev, data[0]]);
          toast({
            title: "Sucesso",
            description: "Tipo de lead criado com sucesso!"
          });
        }
      }

      setIsDialogOpen(false);
      // Recarregar para ter os dados mais atualizados
      fetchLeadTypes();
    } catch (error) {
      console.error('Erro ao salvar tipo de lead:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLeadType = async () => {
    if (!currentLeadType) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('lead_type')
        .delete()
        .eq('id', currentLeadType.id);

      if (error) throw error;
      
      setLeadTypes(leadTypes.filter(lt => lt.id !== currentLeadType.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Sucesso",
        description: "Tipo de lead excluído com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao excluir tipo de lead:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (leadType: LeadType) => {
    try {
      const newStatus = !leadType.active;
      
      const { error } = await supabase
        .from('lead_type')
        .update({ active: newStatus })
        .eq('id', leadType.id);

      if (error) throw error;
      
      const updatedLeadTypes = leadTypes.map(lt => 
        lt.id === leadType.id 
          ? { ...lt, active: newStatus }
          : lt
      );
      
      setLeadTypes(updatedLeadTypes);
      
      toast({
        title: "Status atualizado",
        description: `Tipo de lead ${newStatus ? 'ativado' : 'desativado'} com sucesso!`
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: errorMessage
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Tipos de Lead</h2>
        <Button 
          onClick={handleOpenNewDialog}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Tipo de Lead
        </Button>
      </div>

      {isLoading && <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>}

      {!isLoading && leadTypes.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <h3 className="font-medium mb-2">Nenhum tipo de lead encontrado</h3>
          <p className="text-muted-foreground mb-4">Clique no botão acima para adicionar seu primeiro tipo de lead.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 text-center">Nome</TableHead>
                <TableHead className="w-1/3 text-center">Status</TableHead>
                <TableHead className="w-1/3 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadTypes.map((leadType) => (
                <TableRow key={leadType.id}>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge className={leadType.cor}>
                        {leadType.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge variant={leadType.active ? "success" : "destructive"}>
                        {leadType.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenEditDialog(leadType)}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      
                      <CustomSwitch 
                        checked={leadType.active}
                        onCheckedChange={() => toggleStatus(leadType)}
                        aria-label={leadType.active ? "Desativar tipo de lead" : "Ativar tipo de lead"}
                      />
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(leadType)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Lead Type Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentLeadType ? 'Editar Tipo de Lead' : 'Adicionar Tipo de Lead'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newLeadType.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ex: Cliente, Prospect"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer border-2 ${
                      newLeadType.cor === option.value ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => handleInputChange('cor', option.value)}
                  >
                    <div className={`w-4 h-4 rounded ${option.value.split(' ')[0]}`}></div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSaveLeadType} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          
          <div>
            <p>Tem certeza que deseja excluir o tipo de lead <strong>{currentLeadType?.name}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">Esta ação não poderá ser desfeita.</p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteLeadType} 
              disabled={isLoading}
            >
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
