
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
import { PlayCircle, FileText, Flame, GitFork } from "lucide-react";
import { Call, StatusMap, LeadTemperature } from "@/types/calls";

interface CallsTableProps {
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

const temperatureConfig: Record<LeadTemperature, { label: string; color: string }> = {
  cold: { label: "Lead Frio", color: "bg-blue-100 text-blue-800" },
  warm: { label: "Lead Morno", color: "bg-yellow-100 text-yellow-800" },
  hot: { label: "Lead Quente", color: "bg-red-100 text-red-800" },
};

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallsTableProps) => {
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
            <TableHead>Funil (CRM)</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => {
            const status = statusMap[call.status];
            const StatusIcon = status.icon;
            const temperature = call.analysis?.sentiment?.temperature 
              ? temperatureConfig[call.analysis.sentiment.temperature]
              : null;

            return (
              <TableRow key={call.id}>
                <TableCell>{formatDate(call.date)}</TableCell>
                <TableCell>{call.phone}</TableCell>
                <TableCell>{call.duration}</TableCell>
                <TableCell>{call.seller}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`flex items-center gap-1 w-fit ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                    {call.status === "processed" && temperature && (
                      <Badge
                        variant="secondary"
                        className={`flex items-center gap-1 w-fit ${temperature.color}`}
                      >
                        <Flame className="w-3 h-3" />
                        {temperature.label}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {call.status === "processed" && call.crmInfo ? (
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">
                        {call.crmInfo.funnel}
                        <span className="text-muted-foreground"> → </span>
                        {call.crmInfo.stage}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPlayAudio(call.audioUrl)}
                      className="hover:text-primary"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                    {call.status === "processed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewAnalysis(call)}
                        className="hover:text-primary"
                      >
                        <FileText className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )})}
        </TableBody>
      </Table>
    </div>
  );
};
