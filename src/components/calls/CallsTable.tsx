
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Call, StatusMap } from "@/types/calls";
import { Button } from "../ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CallsTableProps {
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
  sortOrder: 'asc' | 'desc' | null;
  onSort: () => void;
}

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
  sortOrder,
  onSort,
}: CallsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px] cursor-pointer" onClick={onSort}>
            <div className="flex items-center gap-2">
              Nome do Lead
              {sortOrder === 'asc' && <ChevronUp className="h-4 w-4" />}
              {sortOrder === 'desc' && <ChevronDown className="h-4 w-4" />}
            </div>
          </TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id}>
            <TableCell className="font-medium">
              {call.leadInfo.firstName} {call.leadInfo.lastName}
            </TableCell>
            <TableCell>{call.leadInfo.email}</TableCell>
            <TableCell>{call.leadInfo.phone}</TableCell>
            <TableCell>{formatDate(call.date)}</TableCell>
            <TableCell>{call.duration}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${statusMap[call.status].color}`}>
                {statusMap[call.status].label}
              </span>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPlayAudio(call.audioUrl)}
              >
                Ouvir
              </Button>
              {call.analysis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewAnalysis(call)}
                >
                  Ver Análise
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
