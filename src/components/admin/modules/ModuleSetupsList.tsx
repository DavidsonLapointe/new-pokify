
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, CheckCircle2, AlertTriangle, CalendarIcon, UserRound, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface para os dados de setup
interface ModuleSetup {
  id: string;
  organization: {
    id: string;
    name: string;
  };
  module: {
    id: string;
    name: string;
  };
  contactName: string;
  contactPhone: string;
  contractedAt: Date;
  status: "pending" | "in_progress" | "completed";
}

export const ModuleSetupsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Dados de exemplo para implantações de setup
  const moduleSetups: ModuleSetup[] = [
    {
      id: "1",
      organization: {
        id: "org1",
        name: "Empresa ABC Ltda"
      },
      module: {
        id: "video",
        name: "Prospecção com Vídeo"
      },
      contactName: "João Silva",
      contactPhone: "(11) 99999-8888",
      contractedAt: new Date(2023, 5, 15),
      status: "completed"
    },
    {
      id: "2",
      organization: {
        id: "org2",
        name: "XYZ Comércio S.A."
      },
      module: {
        id: "inbound",
        name: "Atendente Inbound"
      },
      contactName: "Maria Oliveira",
      contactPhone: "(21) 98888-7777",
      contractedAt: new Date(2023, 6, 10),
      status: "in_progress"
    },
    {
      id: "3",
      organization: {
        id: "org3",
        name: "Tech Solutions"
      },
      module: {
        id: "call",
        name: "Análise de Call"
      },
      contactName: "Pedro Santos",
      contactPhone: "(31) 97777-6666",
      contractedAt: new Date(),
      status: "pending"
    }
  ];
  
  // Filtrar setups com base na busca e no filtro de status
  const filteredSetups = moduleSetups.filter(setup => {
    const matchesSearch = 
      setup.organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <TooltipProvider>
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Implantação de Setup</CardTitle>
          </CardHeader>
          
          <CardContent>
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
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
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
                    <TableHead className="font-medium">Empresa</TableHead>
                    <TableHead className="font-medium">Módulo</TableHead>
                    <TableHead className="font-medium">Nome do Implantador</TableHead>
                    <TableHead className="font-medium">Telefone</TableHead>
                    <TableHead className="font-medium">Data de Contratação</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSetups.length > 0 ? (
                    filteredSetups.map((setup) => (
                      <TableRow key={setup.id}>
                        <TableCell>{setup.organization.name}</TableCell>
                        <TableCell>{setup.module.name}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                          {setup.contactName}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1 text-blue-600"
                              >
                                <PhoneCall className="h-3.5 w-3.5" />
                                {setup.contactPhone}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Clique para copiar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(setup.contractedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(setup.status)}>
                            {getStatusText(setup.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma implantação encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
