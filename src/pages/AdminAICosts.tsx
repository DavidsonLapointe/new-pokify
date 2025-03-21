
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CpuIcon } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

// Mock data for AI executions - in a real app, this would come from an API
const mockAIExecutions = [
  {
    id: "1",
    modelName: "GPT-4o",
    organizationName: "Acme Inc",
    executionDate: new Date("2023-09-15T10:30:00"),
    llmDetails: [
      { name: "TokenProcessing", cost: 0.0012 },
      { name: "EmbeddingGeneration", cost: 0.0008 }
    ],
    totalCost: 0.002
  },
  {
    id: "2",
    modelName: "Claude 3",
    organizationName: "TechCorp",
    executionDate: new Date("2023-09-15T14:45:00"),
    llmDetails: [
      { name: "TokenProcessing", cost: 0.0015 },
      { name: "ImageAnalysis", cost: 0.0025 }
    ],
    totalCost: 0.004
  },
  {
    id: "3",
    modelName: "GPT-4o-mini",
    organizationName: "Global Services",
    executionDate: new Date("2023-09-14T09:15:00"),
    llmDetails: [
      { name: "TokenProcessing", cost: 0.0008 },
      { name: "TextSummarization", cost: 0.0005 }
    ],
    totalCost: 0.0013
  },
  {
    id: "4",
    modelName: "GPT-4o",
    organizationName: "Acme Inc",
    executionDate: new Date("2023-09-14T16:20:00"),
    llmDetails: [
      { name: "TokenProcessing", cost: 0.0018 },
      { name: "TranslationService", cost: 0.0012 }
    ],
    totalCost: 0.003
  },
  {
    id: "5",
    modelName: "Claude 3",
    organizationName: "DataSystems",
    executionDate: new Date("2023-09-13T11:05:00"),
    llmDetails: [
      { name: "TokenProcessing", cost: 0.0014 },
      { name: "SemanticSearch", cost: 0.0022 }
    ],
    totalCost: 0.0036
  },
];

const AdminAICosts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch AI executions data
  const { data: aiExecutions, isLoading } = useQuery({
    queryKey: ['ai-executions'],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return mockAIExecutions;
    }
  });

  // Filter executions based on search term and date
  const filteredExecutions = aiExecutions?.filter(execution => {
    const matchesSearch = searchTerm === "" || 
      execution.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === "" || 
      format(execution.executionDate, "yyyy-MM-dd") === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  // Calculate total cost of all filtered executions
  const totalCost = filteredExecutions?.reduce((sum, execution) => sum + execution.totalCost, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Custo de IA</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as execuções de IA e seus custos associados
        </p>
      </div>

      {/* Stats Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumo de Custos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Execuções</p>
              <p className="text-2xl font-medium">{filteredExecutions?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo Total</p>
              <p className="text-2xl font-medium">
                {isLoading ? 
                  <Skeleton className="h-8 w-24" /> : 
                  `$${totalCost.toFixed(4)}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo Médio por Execução</p>
              <p className="text-2xl font-medium">
                {isLoading ? 
                  <Skeleton className="h-8 w-24" /> : 
                  `$${(filteredExecutions?.length ? totalCost / filteredExecutions.length : 0).toFixed(4)}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-2">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar por modelo ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-72">
          <Label htmlFor="date" className="mb-2">Data de Execução</Label>
          <Input
            id="date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead>LLMs Utilizadas</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredExecutions?.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Nenhuma execução de IA encontrada com os filtros atuais
                  </TableCell>
                </TableRow>
              ) : (
                // Data rows
                filteredExecutions?.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>{execution.modelName}</TableCell>
                    <TableCell>{execution.organizationName}</TableCell>
                    <TableCell>
                      {format(execution.executionDate, "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {execution.llmDetails.map((llm, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{llm.name}</span>
                            <span className="text-muted-foreground">${llm.cost.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${execution.totalCost.toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAICosts;
