
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CpuIcon, FilterX } from "lucide-react";
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock data for AI executions - in a real app, this would come from an API
const mockAIExecutions = [
  {
    id: "1",
    toolName: "Lead Analyzer",
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
    toolName: "Call Transcriber",
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
    toolName: "Content Summarizer",
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
    toolName: "Lead Analyzer",
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
    toolName: "Knowledge Base Query",
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
  const [toolFilter, setToolFilter] = useState("");
  const [activeTab, setActiveTab] = useState("execucoes");

  // Fetch AI executions data
  const { data: aiExecutions, isLoading } = useQuery({
    queryKey: ['ai-executions'],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return mockAIExecutions;
    }
  });

  // Get unique tool names for filter
  const uniqueToolNames = [...new Set(mockAIExecutions.map(execution => execution.toolName))];

  // Filter executions based on search term and tool
  const filteredExecutions = aiExecutions?.filter(execution => {
    const matchesSearch = searchTerm === "" || 
      execution.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTool = toolFilter === "" || toolFilter === "all" || 
      execution.toolName === toolFilter;
    
    return matchesSearch && matchesTool;
  });

  // Calculate total cost of all filtered executions
  const totalCost = filteredExecutions?.reduce((sum, execution) => sum + execution.totalCost, 0) || 0;

  // Summary Card Component
  const SummaryCard = () => (
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
  );

  // Executions Table Component
  const ExecutionsTable = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Ferramenta de IA</TableHead>
              <TableHead className="text-left">Data e Hora</TableHead>
              <TableHead className="text-right">Custo Total</TableHead>
              <TableHead className="text-right pr-8">Empresa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                </TableRow>
              ))
            ) : filteredExecutions?.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Nenhuma execução de IA encontrada com os filtros atuais
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              filteredExecutions?.map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell className="font-medium text-foreground text-left">
                    {execution.toolName}
                  </TableCell>
                  <TableCell className="text-left">
                    {format(execution.executionDate, "dd/MM/yyyy 'às' HH:mm")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">${execution.totalCost.toFixed(4)}</span>
                        </TooltipTrigger>
                        <TooltipContent className="w-64 p-0">
                          <div className="bg-white rounded-md shadow-md p-3">
                            <p className="font-semibold text-sm mb-2">Detalhamento de custos:</p>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">Modelo:</span>
                                <span>{execution.modelName}</span>
                              </div>
                              {execution.llmDetails.map((llm, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{llm.name}:</span>
                                  <span>${llm.cost.toFixed(4)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-sm border-t pt-1 mt-1 font-medium">
                                <span>Total:</span>
                                <span>${execution.totalCost.toFixed(4)}</span>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">{execution.organizationName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Custo de IA</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as execuções de IA e seus custos associados
        </p>
      </div>

      <Tabs 
        defaultValue="execucoes" 
        className="mb-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="execucoes">Execuções</TabsTrigger>
          <TabsTrigger value="relatorio">Relatório Analítico</TabsTrigger>
        </TabsList>

        <TabsContent value="execucoes" className="mt-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-72">
              <Label htmlFor="tool" className="mb-2">Ferramenta de IA</Label>
              <Select
                value={toolFilter}
                onValueChange={setToolFilter}
              >
                <SelectTrigger id="tool">
                  <SelectValue placeholder="Todas as ferramentas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ferramentas</SelectItem>
                  {uniqueToolNames.map((tool) => (
                    <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="cancel"
                className="flex items-center gap-2"
                onClick={() => {
                  setSearchTerm("");
                  setToolFilter("");
                }}
              >
                <FilterX className="h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <ExecutionsTable />
        </TabsContent>

        <TabsContent value="relatorio" className="mt-6">
          <SummaryCard />
          
          {/* We could add additional analytics content here */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Análise Detalhada</h3>
              <p className="text-muted-foreground">
                Este relatório mostra um resumo detalhado dos custos de IA para o período atual.
                Utilize estes dados para planejar e otimizar o uso dos recursos de IA.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAICosts;
