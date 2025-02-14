import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { CallAnalysisDialog } from "@/components/calls/CallAnalysisDialog";
import { Call, StatusMap } from "@/types/calls";

// Mock data for calls with analysis
const mockCalls: Call[] = [
  {
    id: 1,
    date: "2024-02-20T14:30:00",
    phone: "(11) 98765-4321",
    duration: "2:35",
    status: "processed",
    seller: "João Silva",
    audioUrl: "https://example.com/audio1.mp3",
    analysis: {
      transcription: "Vendedor: Olá, bom dia! Em que posso ajudar?\nCliente: Bom dia! Gostaria de saber mais sobre os planos empresariais...",
      summary: "Cliente demonstrou interesse nos planos empresariais, especialmente no módulo de gestão de vendas. Possui uma equipe de 15 vendedores e busca melhorar o processo de acompanhamento de leads.",
      sentiment: {
        temperature: "hot",
        reason: "Cliente demonstrou forte interesse no produto, fez perguntas específicas sobre funcionalidades e mencionou orçamento disponível. Solicita uma proposta comercial com urgência.",
      },
      leadInfo: {
        name: "Carlos Silva",
        email: "carlos.silva@empresa.com.br",
        phone: "(11) 98765-4321",
        company: "Empresa XYZ Ltda",
        position: "Diretor Comercial",
        budget: "R$ 5.000 - R$ 10.000 / mês",
        interests: ["Gestão de Vendas", "Automação", "Relatórios"],
        painPoints: [
          "Dificuldade em acompanhar performance dos vendedores",
          "Perda de oportunidades por falta de follow-up",
          "Processo manual de geração de relatórios",
        ],
        nextSteps: "Agendar demonstração técnica com a equipe de TI para a próxima semana",
      },
    },
  },
  {
    id: 2,
    date: "2024-02-20T15:15:00",
    phone: "(11) 98765-4322",
    duration: "1:45",
    status: "pending",
    seller: "Maria Santos",
    audioUrl: "https://example.com/audio2.mp3",
  },
  {
    id: 3,
    date: "2024-02-20T16:00:00",
    phone: "(11) 98765-4323",
    duration: "0:45",
    status: "failed",
    seller: "Pedro Oliveira",
    audioUrl: "https://example.com/audio3.mp3",
  },
];

const statusMap: StatusMap = {
  processed: {
    label: "Processada",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  failed: {
    label: "Erro",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

const OrganizationCalls = () => {
  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [monthStats, setMonthStats] = useState({
    total: 0,
    processed: 0,
    pending: 0,
    failed: 0,
  });

  const getMonthYearOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      options.push(monthYear);
    }
    
    return options;
  };

  const handleMonthYearChange = (value: string) => {
    setSelectedMonthYear(value);
    const [month, year] = value.split('/');
    const total = Math.floor(Math.random() * 100) + 50;
    const processed = Math.floor(total * 0.7);
    const pending = Math.floor(total * 0.2);
    const failed = total - processed - pending;
    
    setMonthStats({
      total,
      processed,
      pending,
      failed,
    });
  };

  const handlePlayAudio = (audioUrl: string) => {
    console.log(`Reproduzindo áudio: ${audioUrl}`);
  };

  const filteredCalls = mockCalls.filter((call) => {
    const matchesStatus = selectedStatus === "all" || call.status === selectedStatus;
    const matchesSearch =
      call.phone.includes(searchQuery) ||
      call.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handleViewAnalysis = (call: Call) => {
    setSelectedCall(call);
    setIsAnalysisOpen(true);
  };

  const handleCloseAnalysis = () => {
    setIsAnalysisOpen(false);
    setSelectedCall(null);
  };

  const handleCreateLead = (data: any) => {
    console.log("Novo lead:", data);
    // Aqui você implementará a lógica de criação do lead
    // baseada no tipo de contato (telefone ou email)
  };

  return (
    <OrganizationLayout>
      <TooltipProvider>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold">Chamadas</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie todas as chamadas recebidas
            </p>
          </div>

          <CallsStats {...monthStats} />

          <Card className="p-6">
            <CallsFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedMonthYear={selectedMonthYear}
              onMonthYearChange={handleMonthYearChange}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              monthYearOptions={getMonthYearOptions()}
            />

            <CallsTable
              calls={filteredCalls}
              statusMap={statusMap}
              onPlayAudio={handlePlayAudio}
              onViewAnalysis={handleViewAnalysis}
              formatDate={formatDate}
            />
          </Card>

          <CallAnalysisDialog
            isOpen={isAnalysisOpen}
            onClose={handleCloseAnalysis}
            analysis={selectedCall?.analysis}
          />
        </div>
      </TooltipProvider>
    </OrganizationLayout>
  );
};

export default OrganizationCalls;
