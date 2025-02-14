
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] text-xs whitespace-nowrap">Data e Hora</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Telefone</TableHead>
              <TableHead className="w-[80px] text-xs whitespace-nowrap">Duração</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Vendedor</TableHead>
              <TableHead className="w-[220px] text-xs whitespace-nowrap">Status</TableHead>
              <TableHead className="w-[180px] text-xs whitespace-nowrap">Funil (CRM)</TableHead>
              <TableHead className="w-[100px] text-xs whitespace-nowrap">Ações</TableHead>
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
                <TableRow key={call.id} className="text-xs">
                  <TableCell className="py-2 whitespace-nowrap">{formatDate(call.date)}</TableCell>
                  <TableCell className="py-2 whitespace-nowrap">{call.phone}</TableCell>
                  <TableCell className="py-2 whitespace-nowrap">{call.duration}</TableCell>
                  <TableCell className="py-2 whitespace-nowrap">{call.seller}</TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                      {call.status === "success" && temperature && (
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${temperature.color}`}
                        >
                          <Flame className="w-3 h-3" />
                          {temperature.label}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {call.status === "success" && call.crmInfo ? (
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-muted-foreground" />
                        <span>
                          {call.crmInfo.funnel}
                          <span className="text-muted-foreground mx-1">→</span>
                          {call.crmInfo.stage}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPlayAudio(call.audioUrl)}
                        className="hover:text-primary h-7 w-7"
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      {call.status === "success" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewAnalysis(call)}
                          className="hover:text-primary h-7 w-7"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};
