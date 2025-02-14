
import { useState } from "react";
import { Phone, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import OrganizationLayout from "@/components/OrganizationLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";

// Mock data for calls
const mockCalls = [
  {
    id: 1,
    date: "2024-02-20T14:30:00",
    phone: "(11) 98765-4321",
    duration: "2:35",
    status: "processed" as const,
    seller: "João Silva",
  },
  {
    id: 2,
    date: "2024-02-20T15:15:00",
    phone: "(11) 98765-4322",
    duration: "1:45",
    status: "pending" as const,
    seller: "Maria Santos",
  },
  {
    id: 3,
    date: "2024-02-20T16:00:00",
    phone: "(11) 98765-4323",
    duration: "0:45",
    status: "failed" as const,
    seller: "Pedro Oliveira",
  },
];

const statusMap = {
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
    // Aqui você pode adicionar a lógica para filtrar as chamadas por mês/ano
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

        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por telefone ou vendedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <MonthYearSelector
              selectedMonthYear={selectedMonthYear}
              onMonthYearChange={handleMonthYearChange}
              options={getMonthYearOptions()}
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="processed">Processadas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="failed">Com erro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => {
                  const status = statusMap[call.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={call.id}>
                      <TableCell>{formatDate(call.date)}</TableCell>
                      <TableCell>{call.phone}</TableCell>
                      <TableCell>{call.duration}</TableCell>
                      <TableCell>{call.seller}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-1 w-fit ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )})}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationCalls;
