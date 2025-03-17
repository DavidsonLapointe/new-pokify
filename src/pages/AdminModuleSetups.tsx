
import React, { useState } from "react";
import { ModuleSetupsList } from "@/components/admin/modules/ModuleSetupsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, CheckCircle2, Clock, AlertTriangle, ChevronDown } from "lucide-react";

// Mock data for module setups
const mockSetups = [
  {
    id: "1",
    company: "Empresa XYZ Ltda",
    module: "Prospecção com Vídeo",
    implementerName: "João Silva",
    implementerPhone: "(11) 98765-4321",
    contractDate: "2023-08-15T10:30:00Z",
    status: "in_progress"
  },
  {
    id: "2",
    company: "ABC Consultoria",
    module: "Atendente Inbound",
    implementerName: "Maria Souza",
    implementerPhone: "(21) 99876-5432",
    contractDate: "2023-08-10T14:45:00Z",
    status: "pending"
  },
  {
    id: "3",
    company: "Tech Solutions S.A.",
    module: "Análise de Call",
    implementerName: "Carlos Santos",
    implementerPhone: "(31) 97654-3210",
    contractDate: "2023-08-05T09:15:00Z",
    status: "completed"
  },
  {
    id: "4",
    company: "Consultoria Global",
    module: "Assistente de Prospecção",
    implementerName: "Ana Oliveira",
    implementerPhone: "(41) 98877-6655",
    contractDate: "2023-07-28T16:20:00Z",
    status: "completed"
  },
  {
    id: "5",
    company: "Inovação Digital Ltda",
    module: "Prospecção com Vídeo",
    implementerName: "Pedro Costa",
    implementerPhone: "(51) 96644-3322",
    contractDate: "2023-08-12T11:10:00Z",
    status: "in_progress"
  }
];

const AdminModuleSetups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter setups based on search term and status
  const filteredSetups = mockSetups.filter(setup => {
    const matchesSearch = 
      setup.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
      setup.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.implementerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || setup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge based on status value
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />Pendente
        </Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />Em Andamento
        </Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />Concluído
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Implantação de Módulos</h1>
        <p className="text-muted-foreground">
          Gerencie as implantações de módulos contratados pelas organizações
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Módulos Contratados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por empresa, módulo ou implementador..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Implementador</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data da Contratação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSetups.length > 0 ? (
                  filteredSetups.map((setup) => (
                    <TableRow key={setup.id}>
                      <TableCell className="font-medium">{setup.company}</TableCell>
                      <TableCell>{setup.module}</TableCell>
                      <TableCell>{setup.implementerName}</TableCell>
                      <TableCell>{setup.implementerPhone}</TableCell>
                      <TableCell>{formatDate(setup.contractDate)}</TableCell>
                      <TableCell>{getStatusBadge(setup.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Detalhes <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModuleSetups;
