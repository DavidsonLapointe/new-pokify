
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { CustomSwitch } from "@/components/ui/custom-switch";

interface LeadType {
  id: string;
  name: string;
  label: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  isActive: boolean;
  organization_id: string | null;
}

export const TiposDeLeadTab = () => {
  const { toast } = useToast();
  const [leadTypes, setLeadTypes] = useState<LeadType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLeadType, setCurrentLeadType] = useState<LeadType | null>(null);
  const [newLeadType, setNewLeadType] = useState({
    name: "",
    label: "",
    color: "bg-blue-100 text-blue-800",
    icon: "User",
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  // Available colors for lead types
  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Azul" },
    { value: "bg-green-100 text-green-800", label: "Verde" },
    { value: "bg-orange-100 text-orange-800", label: "Laranja" },
    { value: "bg-purple-100 text-purple-800", label: "Roxo" },
    { value: "bg-red-100 text-red-800", label: "Vermelho" },
    { value: "bg-gray-100 text-gray-800", label: "Cinza" },
  ];

  // Static initial lead types
  const defaultLeadTypes: LeadType[] = [
    {
      id: "1",
      name: "client",
      label: "Cliente",
      color: "bg-blue-100 text-blue-800",
      icon: "User",
      isDefault: true,
      isActive: true,
      organization_id: null
    },
    {
      id: "2",
      name: "prospect",
      label: "Prospect",
      color: "bg-green-100 text-green-800",
      icon: "Users",
      isDefault: true,
      isActive: true,
      organization_id: null
    },
    {
      id: "3",
      name: "employee",
      label: "Funcionário",
      color: "bg-purple-100 text-purple-800",
      icon: "Briefcase",
      isDefault: true,
      isActive: true,
      organization_id: null
    },
    {
      id: "4",
      name: "hr_candidate",
      label: "Candidato RH",
      color: "bg-orange-100 text-orange-800",
      icon: "FileText",
      isDefault: true,
      isActive: true,
      organization_id: null
    },
    {
      id: "5",
      name: "supplier",
      label: "Fornecedor",
      color: "bg-red-100 text-red-800",
      icon: "Truck",
      isDefault: true,
      isActive: true,
      organization_id: null
    }
  ];

  useEffect(() => {
    // Load default lead types
    setLeadTypes(defaultLeadTypes);
  }, []);

  const fetchLeadTypes = async () => {
    // This is just a placeholder for future Supabase integration
    console.log('Will fetch lead types from database in the future');
    setLeadTypes(defaultLeadTypes);
    setIsLoading(false);
  };

  const handleOpenNewDialog = () => {
    setCurrentLeadType(null);
    setNewLeadType({
      name: "",
      label: "",
      color: "bg-blue-100 text-blue-800",
      icon: "User",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (leadType: LeadType) => {
    setCurrentLeadType(leadType);
    setNewLeadType({
      name: leadType.name,
      label: leadType.label,
      color: leadType.color,
      icon: leadType.icon,
      isActive: leadType.isActive
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (leadType: LeadType) => {
    if (leadType.isDefault) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "Tipos de lead padrão do sistema não podem ser excluídos."
      });
      return;
    }
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
    
    if (!newLeadType.label.trim()) {
      toast({
        variant: "destructive",
        title: "Rótulo é obrigatório",
        description: "Por favor, insira um rótulo para o tipo de lead."
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
    
    // Simulate async operation
    setTimeout(() => {
      try {
        if (currentLeadType?.isDefault) {
          // For system default types, only allow updating label, color and icon
          const updatedLeadTypes = leadTypes.map(lt => 
            lt.id === currentLeadType.id 
              ? {
                  ...lt,
                  label: newLeadType.label,
                  color: newLeadType.color,
                  icon: newLeadType.icon,
                  isActive: newLeadType.isActive
                }
              : lt
          );
          setLeadTypes(updatedLeadTypes);
        } else if (currentLeadType) {
          // Updating existing custom lead type
          const updatedLeadTypes = leadTypes.map(lt => 
            lt.id === currentLeadType.id 
              ? {
                  ...lt,
                  name: newLeadType.name,
                  label: newLeadType.label,
                  color: newLeadType.color,
                  icon: newLeadType.icon,
                  isActive: newLeadType.isActive
                }
              : lt
          );
          setLeadTypes(updatedLeadTypes);
        } else {
          // Creating new lead type
          const newId = uuidv4();
          setLeadTypes([
            ...leadTypes,
            {
              id: newId,
              name: newLeadType.name,
              label: newLeadType.label,
              color: newLeadType.color,
              icon: newLeadType.icon,
              isActive: newLeadType.isActive,
              isDefault: false,
              organization_id: "organization_id_placeholder"
            }
          ]);
        }

        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: currentLeadType ? "Tipo de lead atualizado com sucesso!" : "Tipo de lead criado com sucesso!"
        });
      } catch (error) {
        console.error('Error saving lead type:', error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar o tipo de lead. Por favor, tente novamente."
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleDeleteLeadType = async () => {
    if (!currentLeadType) return;
    
    setIsLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
      try {
        setLeadTypes(leadTypes.filter(lt => lt.id !== currentLeadType.id));
        setIsDeleteDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Tipo de lead excluído com sucesso!"
        });
      } catch (error) {
        console.error('Error deleting lead type:', error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Ocorreu um erro ao excluir o tipo de lead. Por favor, tente novamente."
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const toggleStatus = async (leadType: LeadType) => {
    try {
      const updatedLeadTypes = leadTypes.map(lt => 
        lt.id === leadType.id 
          ? { ...lt, isActive: !lt.isActive }
          : lt
      );
      setLeadTypes(updatedLeadTypes);
      toast({
        title: "Status atualizado",
        description: `Tipo de lead ${leadType.isActive ? 'desativado' : 'ativado'} com sucesso!`
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do tipo de lead."
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
                <TableHead>Nome</TableHead>
                <TableHead>Rótulo</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadTypes.map((leadType) => (
                <TableRow key={leadType.id}>
                  <TableCell className="font-medium">{leadType.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={leadType.color}>
                      {leadType.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`w-6 h-6 rounded ${leadType.color.split(' ')[0]}`}></div>
                  </TableCell>
                  <TableCell>
                    {leadType.isDefault ? (
                      <Badge variant="outline" className="bg-blue-50">Sistema</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50">Personalizado</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={leadType.isActive ? "success" : "destructive"}>
                      {leadType.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenEditDialog(leadType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <CustomSwitch 
                        checked={leadType.isActive}
                        onCheckedChange={() => toggleStatus(leadType)}
                        aria-label={leadType.isActive ? "Desativar tipo de lead" : "Ativar tipo de lead"}
                      />
                      
                      {!leadType.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(leadType)}
                          disabled={leadType.isDefault}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
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
              <Label htmlFor="name">Nome (identificador único)</Label>
              <Input
                id="name"
                value={newLeadType.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={Boolean(currentLeadType?.isDefault)}
                placeholder="ex: client, prospect, partner"
              />
              {currentLeadType?.isDefault && (
                <p className="text-xs text-muted-foreground">O nome dos tipos de lead padrão do sistema não pode ser alterado.</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="label">Rótulo (exibido na interface)</Label>
              <Input
                id="label"
                value={newLeadType.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                placeholder="ex: Cliente, Prospect, Parceiro"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer border-2 ${
                      newLeadType.color === option.value ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => handleInputChange('color', option.value)}
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
            <p>Tem certeza que deseja excluir o tipo de lead <strong>{currentLeadType?.label}</strong>?</p>
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
