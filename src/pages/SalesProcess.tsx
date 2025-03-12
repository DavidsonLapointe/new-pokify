import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, Users, Phone, ChartBar, List, SearchIcon, PhoneOutgoing, 
  Calendar, User, FileBarChart, XCircle, CheckCircle2, ArrowRight
} from "lucide-react";
import { LeadStatusBadge } from "@/components/calls/LeadStatusBadge";
import { LeadTemperatureBadge } from "@/components/calls/LeadTemperatureBadge";
import { cn } from "@/lib/utils";

// Sample data for demonstration
const SAMPLE_LEADS = [
  {
    id: "1",
    name: "João Silva",
    company: "ABC Tech",
    stage: "lead_generation",
    status: "active",
    temperature: "hot",
    lastActivity: "2023-06-15T10:30:00",
    phone: "(11) 98765-4321",
    email: "joao.silva@example.com",
    hasProcessed: true,
    calls: [{ temperature: "hot", date: "2023-06-15T10:30:00" }]
  },
  {
    id: "2",
    name: "Maria Oliveira",
    company: "XYZ Solutions",
    stage: "inbound_prospecting",
    status: "active",
    temperature: "warm",
    lastActivity: "2023-06-14T14:45:00",
    phone: "(11) 91234-5678",
    email: "maria.oliveira@example.com",
    hasProcessed: true,
    calls: [{ temperature: "warm", date: "2023-06-14T14:45:00" }]
  },
  {
    id: "3",
    name: "Carlos Mendes",
    company: "GlobalTech",
    stage: "qualification_call",
    status: "pending",
    temperature: "cold",
    lastActivity: "2023-06-13T09:15:00",
    phone: "(11) 95555-4444",
    email: "carlos.mendes@example.com",
    hasProcessed: true,
    calls: [{ temperature: "cold", date: "2023-06-13T09:15:00" }]
  },
  {
    id: "4",
    name: "Ana Castro",
    company: "Inovação Ltda",
    stage: "qualification_analysis",
    status: "active",
    temperature: "warm",
    lastActivity: "2023-06-12T16:20:00",
    phone: "(11) 97777-8888",
    email: "ana.castro@example.com",
    hasProcessed: true,
    calls: [{ temperature: "warm", date: "2023-06-12T16:20:00" }]
  },
  {
    id: "5",
    name: "Roberto Almeida",
    company: "RB Consulting",
    stage: "closer_won",
    status: "active",
    temperature: "hot",
    lastActivity: "2023-06-11T11:00:00",
    phone: "(11) 93333-2222",
    email: "roberto.almeida@example.com",
    hasProcessed: true,
    calls: [{ temperature: "hot", date: "2023-06-11T11:00:00" }]
  },
  {
    id: "6",
    name: "Lucia Ferreira",
    company: "Ferreira Solutions",
    stage: "lead_lost",
    status: "pending",
    temperature: "cold",
    lastActivity: "2023-06-10T15:30:00",
    phone: "(11) 94444-3333",
    email: "lucia.ferreira@example.com",
    hasProcessed: true,
    calls: [{ temperature: "cold", date: "2023-06-10T15:30:00" }]
  }
];

// Stage configuration with icons and descriptions
const SALES_STAGES = [
  {
    id: "lead_generation",
    name: "Geração de Leads",
    icon: List,
    description: "Criação de listas de potenciais clientes para contato.",
    aiSolution: "IA para identificação e qualificação prévia de leads com maior potencial."
  },
  {
    id: "inbound_prospecting",
    name: "Prospecção Inbound",
    icon: SearchIcon,
    description: "Atração de leads através de conteúdo e marketing digital.",
    aiSolution: "Chatbots inteligentes para qualificação inicial e direcionamento."
  },
  {
    id: "outbound_prospecting",
    name: "Prospecção Outbound",
    icon: PhoneOutgoing,
    description: "Abordagem ativa de leads através de ligações e emails.",
    aiSolution: "Recomendação de scripts personalizados baseados no perfil do lead."
  },
  {
    id: "call_scheduling",
    name: "Agendamento de Call",
    icon: Calendar,
    description: "Marcação de horário para call de qualificação.",
    aiSolution: "Assistente virtual para gerenciamento de agenda e follow-ups automáticos."
  },
  {
    id: "qualification_call",
    name: "Call de Qualificação",
    icon: Phone,
    description: "Ligação para avaliação de fit e qualificação do lead.",
    aiSolution: "Sugestões em tempo real durante a call baseadas na conversa."
  },
  {
    id: "qualification_analysis",
    name: "Análise de Qualificação",
    icon: FileBarChart,
    description: "Avaliação dos dados coletados na call de qualificação.",
    aiSolution: "Análise automática da call com identificação de pontos-chave e próximos passos."
  },
  {
    id: "closer_won",
    name: "Ganho para Closer",
    icon: CheckCircle2,
    description: "Lead qualificado e pronto para ser passado ao closer.",
    aiSolution: "Resumo automático do lead e recomendações para abordagem do closer."
  },
  {
    id: "lead_lost",
    name: "Perda do Lead",
    icon: XCircle,
    description: "Lead descartado por falta de fit ou outros motivos.",
    aiSolution: "Análise das razões de perda e sugestões para melhorias no processo."
  }
];

const SalesProcess = () => {
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const filteredLeads = selectedStage === "all" 
    ? SAMPLE_LEADS 
    : SAMPLE_LEADS.filter(lead => lead.stage === selectedStage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStageIcon = (stage: string) => {
    const stageConfig = SALES_STAGES.find(s => s.id === stage);
    if (!stageConfig?.icon) return null;
    const Icon = stageConfig.icon;
    return <Icon className="w-4 h-4 text-[#9b87f5]" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-[#9b87f5] fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white">
            <Building2 className="w-4 h-4 text-white" />
            <span className="font-medium">Empresa Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-white">Usuário Demo</p>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="w-64 bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30 border-r border-gray-200">
        <nav className="flex flex-col h-full py-6 px-3">
          <div className="space-y-0.5">
            <a href="#" className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-[#9b87f5]">
              <ChartBar className="w-4 h-4 mr-3 text-[#9b87f5]" />
              Dashboard
            </a>
            <a href="#" className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] bg-[#F1F0FB] text-[#9b87f5]">
              <Users className="w-4 h-4 mr-3 text-[#9b87f5]" />
              Processo de Vendas
            </a>
            <a href="#" className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-gray-600" />
              Chamadas
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16">
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Processo de Vendas</h1>
              <p className="text-muted-foreground">
                Acompanhe a jornada de seus leads pelo funil de vendas
              </p>
            </div>

            {/* Sales Process Flow */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Jornada do Lead</h2>
              <div className="flex flex-wrap items-center justify-between gap-2">
                {SALES_STAGES.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    <div 
                      className={cn(
                        "flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all",
                        selectedStage === stage.id ? "bg-[#F1F0FB] ring-2 ring-[#9b87f5]" : "hover:bg-gray-50"
                      )}
                      onClick={() => setSelectedStage(stage.id)}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        selectedStage === stage.id ? "bg-[#9b87f5] text-white" : "bg-gray-100 text-gray-600"
                      )}>
                        {React.createElement(stage.icon, { className: "w-6 h-6" })}
                      </div>
                      <span className="text-xs font-medium mt-2 text-center max-w-[80px]">{stage.name}</span>
                    </div>
                    {index < SALES_STAGES.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Stage Details and AI Solutions */}
            {selectedStage !== "all" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {renderStageIcon(selectedStage)}
                    {SALES_STAGES.find(s => s.id === selectedStage)?.name}
                  </CardTitle>
                  <CardDescription>
                    {SALES_STAGES.find(s => s.id === selectedStage)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#F1F0FB] p-4 rounded-md">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <FileBarChart className="w-4 h-4 text-[#9b87f5]" />
                      Solução de IA para esta etapa
                    </h3>
                    <p className="text-sm text-gray-700">
                      {SALES_STAGES.find(s => s.id === selectedStage)?.aiSolution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Leads
                  {selectedStage !== "all" && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({SALES_STAGES.find(s => s.id === selectedStage)?.name})
                    </span>
                  )}
                </CardTitle>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedStage("all")}
                    className={selectedStage === "all" ? "bg-[#F1F0FB] text-[#9b87f5]" : ""}
                  >
                    Todos os Leads
                  </Button>
                  <Button variant="default" size="sm" className="bg-[#9b87f5] hover:bg-[#8a76e4]">
                    <User className="w-4 h-4 mr-2" />
                    Novo Lead
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Interesse</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map(lead => (
                      <TableRow key={lead.id} className={selectedLead === lead.id ? "bg-[#F1F0FB]" : ""}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {renderStageIcon(lead.stage)}
                            <span className="text-xs">
                              {SALES_STAGES.find(s => s.id === lead.stage)?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <LeadStatusBadge status={lead.status as any} />
                        </TableCell>
                        <TableCell>
                          <LeadTemperatureBadge calls={lead.calls as any} hasProcessed={lead.hasProcessed} />
                        </TableCell>
                        <TableCell>{formatDate(lead.lastActivity)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedLead(lead.id === selectedLead ? null : lead.id)}
                            >
                              {lead.id === selectedLead ? "Fechar" : "Detalhes"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Lead Details (when a lead is selected) */}
            {selectedLead && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="info">
                    <TabsList className="mb-4">
                      <TabsTrigger value="info">Informações</TabsTrigger>
                      <TabsTrigger value="history">Histórico</TabsTrigger>
                      <TabsTrigger value="analysis">Análise de IA</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info">
                      {(() => {
                        const lead = SAMPLE_LEADS.find(l => l.id === selectedLead);
                        if (!lead) return null;
                        
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                              <p>{lead.name}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                              <p>{lead.company}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Email</h3>
                              <p>{lead.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                              <p>{lead.phone}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Etapa Atual</h3>
                              <p className="flex items-center gap-2">
                                {SALES_STAGES.find(s => s.id === lead.stage)?.icon && (
                                  <SALES_STAGES.find(s => s.id === lead.stage)?.icon className="w-4 h-4 text-[#9b87f5]" />
                                )}
                                {SALES_STAGES.find(s => s.id === lead.stage)?.name}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Última Atividade</h3>
                              <p>{formatDate(lead.lastActivity)}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <p className="text-sm text-gray-500 mb-4">Histórico de interações com o lead</p>
                      <div className="space-y-4">
                        <div className="border-l-2 border-[#9b87f5] pl-4 py-1">
                          <p className="text-sm font-medium">Lead criado</p>
                          <p className="text-xs text-gray-500">12/06/2023, 10:30</p>
                        </div>
                        <div className="border-l-2 border-[#9b87f5] pl-4 py-1">
                          <p className="text-sm font-medium">Email de apresentação enviado</p>
                          <p className="text-xs text-gray-500">13/06/2023, 14:45</p>
                        </div>
                        <div className="border-l-2 border-[#9b87f5] pl-4 py-1">
                          <p className="text-sm font-medium">Call de qualificação agendada</p>
                          <p className="text-xs text-gray-500">14/06/2023, 09:15</p>
                        </div>
                        <div className="border-l-2 border-[#9b87f5] pl-4 py-1">
                          <p className="text-sm font-medium">Call de qualificação realizada</p>
                          <p className="text-xs text-gray-500">15/06/2023, 15:00</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="analysis">
                      <div className="bg-[#F1F0FB] p-4 rounded-md mb-4">
                        <h3 className="text-sm font-semibold mb-2">Análise de Sentimento</h3>
                        <p className="text-sm">Lead demonstrou interesse alto nos produtos de gestão financeira, mas tem preocupações com o prazo de implementação.</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border mb-4">
                        <h3 className="text-sm font-semibold mb-2">Pontos-chave da Conversa</h3>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>Empresa está buscando solução para gestão financeira</li>
                          <li>Orçamento aprovado para o próximo trimestre</li>
                          <li>Preocupação com prazo de implementação (máximo 45 dias)</li>
                          <li>Já utiliza outras soluções da concorrência</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-sm font-semibold mb-2">Recomendações da IA</h3>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>Enfatizar a rapidez de implementação em comparação com a concorrência</li>
                          <li>Apresentar casos de sucesso semelhantes com implementação rápida</li>
                          <li>Destacar integração com as ferramentas que já utilizam</li>
                          <li>Preparar proposta comercial com opções de prazo escalonado</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesProcess;
