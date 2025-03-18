
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { ModuleSetup, SetupStatus } from "@/components/organization/modules/types";

// Interface para props
interface ModuleSetupsListProps {
  onStatusChange?: (setupId: string, moduleId: string, organizationId: string, newStatus: SetupStatus) => void;
}

export const ModuleSetupsList: React.FC<ModuleSetupsListProps> = ({ onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [moduleSetups, setModuleSetups] = useState<ModuleSetup[]>([
    {
      id: "1",
      organizationId: "org1",
      moduleId: "video",
      contactName: "João Silva",
      contactPhone: "(11) 99999-8888",
      contractedAt: new Date(2023, 5, 15),
      status: "pending"
    },
    {
      id: "2",
      organizationId: "org2",
      moduleId: "inbound",
      contactName: "Maria Oliveira",
      contactPhone: "(21) 98888-7777",
      contractedAt: new Date(2023, 6, 10),
      status: "in_progress"
    },
    {
      id: "3",
      organizationId: "org3",
      moduleId: "call",
      contactName: "Pedro Santos",
      contactPhone: "(31) 97777-6666",
      contractedAt: new Date(),
      status: "pending"
    }
  ]);
  
  // Função para atualizar o status de um setup
  const updateStatus = (id: string, newStatus: SetupStatus) => {
    const setup = moduleSetups.find(setup => setup.id === id);
    if (!setup) return;
    
    setModuleSetups(prevSetups => 
      prevSetups.map(setup => 
        setup.id === id ? { ...setup, status: newStatus } : setup
      )
    );
    
    // Chamar função de callback para notificar sobre a mudança
    if (onStatusChange) {
      onStatusChange(id, setup.moduleId, setup.organizationId, newStatus);
    }
    
    toast.success(`Status atualizado com sucesso para ${getStatusText(newStatus)}`);
  };
  
  // Filtrar setups com base na busca e no filtro de status
  const filteredSetups = moduleSetups.filter(setup => {
    const matchesSearch = 
      setup.organizationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.moduleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.contactPhone.includes(searchTerm);
      
    const matchesStatus = !statusFilter || setup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'in_progress':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case 'completed':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return "Pendente";
      case 'in_progress':
        return "Em Andamento";
      case 'completed':
        return "Concluído";
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa, módulo ou contato..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter || ""}
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-left">Empresa</TableHead>
              <TableHead className="font-medium">Módulo</TableHead>
              <TableHead className="font-medium text-left">Nome do Implantador</TableHead>
              <TableHead className="font-medium text-left">Telefone</TableHead>
              <TableHead className="font-medium text-center">Data de Contratação</TableHead>
              <TableHead className="font-medium text-center">Status</TableHead>
              <TableHead className="font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSetups.length > 0 ? (
              filteredSetups.map((setup) => (
                <TableRow key={setup.id}>
                  <TableCell className="text-left">{setup.organizationId}</TableCell>
                  <TableCell>{setup.moduleId}</TableCell>
                  <TableCell className="text-left">{setup.contactName}</TableCell>
                  <TableCell className="text-left">
                    {setup.contactPhone}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(setup.contractedAt, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(setup.status)}>
                      {getStatusText(setup.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreVertical className="h-4 w-4 text-primary" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updateStatus(setup.id, "pending")}
                          disabled={setup.status === "pending"}
                        >
                          Marcar como Pendente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(setup.id, "in_progress")}
                          disabled={setup.status === "in_progress"}
                        >
                          Marcar como Em Andamento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(setup.id, "completed")}
                          disabled={setup.status === "completed"}
                        >
                          Marcar como Concluído
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma implantação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
