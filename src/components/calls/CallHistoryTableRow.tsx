
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Call, StatusMap } from "@/types/calls";
import { FileText, PlayCircle, Video, RefreshCcw, Play } from "lucide-react";

interface CallHistoryTableRowProps {
  call: Call;
  status: StatusMap[keyof StatusMap];
  onMediaPlay: (call: Call) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

export const CallHistoryTableRow = ({
  call,
  status,
  onMediaPlay,
  onViewAnalysis,
  formatDate,
}: CallHistoryTableRowProps) => {
  const StatusIcon = status.icon;
  const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

  const handleReprocess = () => {
    console.log("Reprocessando chamada:", call.id);
  };

  const handleProcess = () => {
    console.log("Processando chamada:", call.id);
  };

  return (
    <TableRow className="text-xs">
      <TableCell className="py-2">{formatDate(call.date)}</TableCell>
      <TableCell className="py-2">{call.seller}</TableCell>
      <TableCell className="py-2">{call.duration}</TableCell>
      <TableCell className="py-2">
        <Badge
          variant="secondary"
          className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${status.color}`}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMediaPlay(call)}
            className="hover:text-primary h-7 w-7"
          >
            <MediaIcon className="h-4 w-4" />
          </Button>
          
          {call.status === "success" && call.analysis && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewAnalysis(call)}
              className="hover:text-primary h-7 w-7"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}

          {call.status === "failed" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReprocess}
              className="hover:text-red-500 h-7 w-7"
              title="Reprocessar chamada"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}

          {call.status === "pending" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProcess}
              className="hover:text-yellow-500 h-7 w-7"
              title="Processar chamada"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
