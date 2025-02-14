
import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { Card } from "@/components/ui/card";
import { CallsFilters } from "@/components/calls/CallsFilters";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsStats } from "@/components/calls/CallsStats";
import { Call, StatusMap } from "@/types/calls";

// Mock data for calls
const mockCalls: Call[] = [
  {
    id: 1,
    date: "2024-02-20T14:30:00",
    phone: "(11) 98765-4321",
    duration: "2:35",
    status: "processed",
    seller: "João Silva",
    audioUrl: "https://example.com/audio1.mp3",
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

  return (
    <OrganizationLayout>
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
            formatDate={formatDate}
          />
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationCalls;
