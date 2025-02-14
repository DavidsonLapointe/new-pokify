
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayCircle } from "lucide-react";
import { Call, StatusMap } from "@/types/calls";

interface CallsTableProps {
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  formatDate: (date: string) => string;
}

export const CallsTable = ({ calls, statusMap, onPlayAudio, formatDate }: CallsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data e Hora</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Áudio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => {
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlayAudio(call.audioUrl)}
                    className="hover:text-primary"
                  >
                    <PlayCircle className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            )})}
        </TableBody>
      </Table>
    </div>
  );
};
